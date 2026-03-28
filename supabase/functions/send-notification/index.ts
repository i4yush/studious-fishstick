import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createAdminClient, jsonResponse, errorResponse } from '../_shared/supabaseAdmin.ts';
import { sendExpoPushNotifications } from '../_shared/pushNotification.ts';
import type { PushMessage } from '../_shared/pushNotification.ts';

interface SendNotificationBody {
    userId: string;
    title: string;
    body: string;
    data?: Record<string, unknown>;
}

Deno.serve(async (req: Request): Promise<Response> => {
    if (req.method !== 'POST') return errorResponse('Method not allowed', 405);

    try {
        const payload = await req.json() as SendNotificationBody;
        const { userId, title, body, data } = payload;

        if (!userId || !title || !body) {
            return errorResponse('userId, title, and body are required');
        }

        const admin = createAdminClient();

        // Fetch push token
        const { data: tokenRow, error: tokenError } = await admin
            .from('push_tokens')
            .select('token')
            .eq('user_id', userId)
            .maybeSingle();

        if (tokenError) throw tokenError;
        if (!tokenRow?.token) {
            return jsonResponse({ sent: false, reason: 'No push token registered' });
        }

        const message: PushMessage = {
            to: tokenRow.token,
            title,
            body,
            data,
            sound: 'default',
        };

        const tickets = await sendExpoPushNotifications([message]);
        const ticket = tickets[0];

        return jsonResponse({
            sent: ticket?.status === 'ok',
            ticketId: ticket?.id,
            error: ticket?.status === 'error' ? ticket.message : undefined,
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal error';
        return errorResponse(message, 500);
    }
});
