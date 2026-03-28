import { createClient } from 'jsr:@supabase/supabase-js@2';

/**
 * Creates a Supabase admin client using the service_role key.
 * Only import this inside Edge Functions — the service_role key
 * must never reach the client bundle.
 */
export function createAdminClient() {
    return createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        { auth: { persistSession: false } },
    );
}

/** Validates the incoming JWT against the project's JWT secret. */
export async function getAuthenticatedUser(req: Request, supabaseUrl: string, anonKey: string) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing Authorization header');

    const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
        auth: { persistSession: false },
    });

    const { data, error } = await userClient.auth.getUser();
    if (error || !data.user) throw new Error('Unauthorized');
    return data.user;
}

export function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

export function errorResponse(message: string, status = 400): Response {
    return jsonResponse({ error: message }, status);
}
