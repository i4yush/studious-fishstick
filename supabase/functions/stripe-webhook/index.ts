import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createAdminClient, jsonResponse, errorResponse } from '../_shared/supabaseAdmin.ts';

// RevenueCat event types we handle
type RevenueCatEventType =
    | 'INITIAL_PURCHASE'
    | 'RENEWAL'
    | 'CANCELLATION'
    | 'EXPIRATION'
    | 'BILLING_ISSUE'
    | 'PRODUCT_CHANGE';

interface RevenueCatWebhookBody {
    event: {
        type: RevenueCatEventType;
        app_user_id: string;
        product_id: string;
        period_type: string;
        expiration_at_ms: number | null;
        original_transaction_id: string;
    };
}

async function verifySignature(req: Request): Promise<boolean> {
    const secret = Deno.env.get('REVENUECAT_WEBHOOK_SECRET') ?? '';
    const authHeader = req.headers.get('Authorization');
    if (!secret || !authHeader) return false;

    // RevenueCat recommends a shared secret via Authorization header
    return authHeader === `Bearer ${secret}`;
}

Deno.serve(async (req: Request): Promise<Response> => {
    if (req.method !== 'POST') return errorResponse('Method not allowed', 405);

    try {
        // Clone request so we can read body twice (signature check + parse)
        const cloned = req.clone();
        const valid = await verifySignature(cloned);
        if (!valid) return errorResponse('Invalid signature', 401);

        const { event } = await req.json() as RevenueCatWebhookBody;
        const { type, app_user_id, product_id, expiration_at_ms, original_transaction_id } = event;

        const admin = createAdminClient();

        const expiresAt = expiration_at_ms
            ? new Date(expiration_at_ms).toISOString()
            : null;

        let status: string;
        switch (type) {
            case 'INITIAL_PURCHASE':
            case 'RENEWAL':
            case 'PRODUCT_CHANGE':
                status = 'active';
                break;
            case 'CANCELLATION':
                status = 'cancelled';
                break;
            case 'EXPIRATION':
            case 'BILLING_ISSUE':
                status = 'expired';
                break;
            default:
                return jsonResponse({ handled: false, type });
        }

        const plan = product_id.includes('annual') ? 'annual' : 'monthly';

        const { error } = await admin.from('subscriptions').upsert(
            {
                user_id: app_user_id,
                revenuecat_id: original_transaction_id,
                plan,
                status,
                expires_at: expiresAt,
                updated_at: new Date().toISOString(),
            },
            { onConflict: 'revenuecat_id' },
        );

        if (error) throw error;

        return jsonResponse({ handled: true, type, status });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal error';
        return errorResponse(message, 500);
    }
});
