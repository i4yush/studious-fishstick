import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createAdminClient, jsonResponse, errorResponse } from '../_shared/supabaseAdmin.ts';

Deno.serve(async (req: Request): Promise<Response> => {
    if (req.method !== 'POST') return errorResponse('Method not allowed', 405);

    try {
        const admin = createAdminClient();

        // 1. Move current weekly leaderboard to history (optional but good practice)
        const { data: leaderboard } = await admin
            .from('leaderboard')
            .select('*')
            .eq('period', 'weekly');

        if (leaderboard && leaderboard.length > 0) {
            const history = leaderboard.map(row => ({
                user_id: row.user_id,
                total_xp: row.total_xp,
                rank: row.rank,
                period_end: new Date().toISOString().split('T')[0],
            }));
            await admin.from('leaderboard_history').insert(history);
        }

        // 2. Reset weekly totals
        const { error } = await admin
            .from('leaderboard')
            .update({ total_xp: 0, updated_at: new Date().toISOString() })
            .eq('period', 'weekly');

        if (error) throw error;

        return jsonResponse({ success: true, message: 'Weekly leaderboard reset complete.' });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal error';
        return errorResponse(message, 500);
    }
});
