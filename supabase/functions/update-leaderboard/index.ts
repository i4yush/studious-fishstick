import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createAdminClient, jsonResponse, errorResponse } from '../_shared/supabaseAdmin.ts';

/**
 * update-leaderboard
 * Triggered by pg_cron every 5 minutes.
 * Recalculates RANK() for both 'weekly' and 'alltime' periods.
 */
Deno.serve(async (req: Request): Promise<Response> => {
    if (req.method !== 'POST') return errorResponse('Method not allowed', 405);

    try {
        const admin = createAdminClient();

        // Use a raw SQL RPC to perform the rank update efficiently
        const { error } = await admin.rpc('recalculate_leaderboard_ranks');

        if (error) {
            // Fallback: manual rank updates per period
            for (const period of ['weekly', 'alltime'] as const) {
                const { data: rows } = await admin
                    .from('leaderboard')
                    .select('id, total_xp')
                    .eq('period', period)
                    .order('total_xp', { ascending: false });

                if (!rows) continue;

                const updates = rows.map((row: { id: string; total_xp: number }, idx: number) => ({
                    id: row.id,
                    rank: idx + 1,
                    updated_at: new Date().toISOString(),
                }));

                for (const update of updates) {
                    await admin
                        .from('leaderboard')
                        .update({ rank: update.rank, updated_at: update.updated_at })
                        .eq('id', update.id);
                }
            }
        }

        return jsonResponse({ success: true, timestamp: new Date().toISOString() });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal error';
        return errorResponse(message, 500);
    }
});
