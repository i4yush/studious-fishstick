import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createAdminClient, getAuthenticatedUser, jsonResponse, errorResponse } from '../_shared/supabaseAdmin.ts';
import { sendExpoPushNotifications } from '../_shared/pushNotification.ts';

interface AwardXPBody {
    userId: string;
    amount: number;
    source: string;
}

Deno.serve(async (req: Request): Promise<Response> => {
    if (req.method !== 'POST') return errorResponse('Method not allowed', 405);

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    try {
        // Validate caller is authenticated
        const user = await getAuthenticatedUser(req, supabaseUrl, anonKey);

        const body = await req.json() as AwardXPBody;
        const { userId, amount, source } = body;

        // Security: Ensure user can only award XP to themselves
        if (user.id !== userId) {
            return errorResponse('Forbidden: You cannot award XP to another user.', 403);
        }

        if (!userId || !amount || amount <= 0 || !source) {
            return errorResponse('Invalid payload: userId, amount > 0, and source are required.');
        }

        const admin = createAdminClient();

        // 1. Check if user is premium for XP multiplier
        const { data: sub } = await admin
            .from('subscriptions')
            .select('status, plan')
            .eq('user_id', userId)
            .eq('status', 'active')
            .maybeSingle();

        const isPremium = !!sub;
        const finalAmount = isPremium && source !== 'daily_login' ? amount * 2 : amount;

        // 2. Insert XP log
        const { error: logError } = await admin.from('xp_logs').insert({
            user_id: userId,
            amount: finalAmount,
            source,
        });

        if (logError) throw logError;

        // 3. Atomically update both leaderboard rows
        const { error: lbError } = await admin.rpc('increment_leaderboard_xp', {
            p_user_id: userId,
            p_amount: finalAmount,
        });

        if (lbError) {
            throw new Error(`Failed to update leaderboard: ${lbError.message}`);
        }

        // 4. Fetch updated total
        const { data: lbRow } = await admin
            .from('leaderboard')
            .select('total_xp')
            .eq('user_id', userId)
            .eq('period', 'alltime')
            .single();

        const newTotal = lbRow?.total_xp ?? 0;

        // 5. Check badge conditions (delegate to unlock-badge function)
        let badgeUnlocked = false;
        let badgeId: string | undefined;

        try {
            const badgeRes = await fetch(`${supabaseUrl}/functions/v1/unlock-badge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''}`,
                },
                body: JSON.stringify({ userId, totalXP: newTotal }),
            });

            if (badgeRes.ok) {
                const badgeData = await badgeRes.json() as { badgeUnlocked: boolean; badgeId?: string };
                badgeUnlocked = badgeData.badgeUnlocked;
                badgeId = badgeData.badgeId;
            }
        } catch {
            // Badge check failure is non-fatal
        }

        // 6. Send XP milestone push if threshold hit
        const milestones = [100, 500, 1000, 5000, 10000];
        for (const m of milestones) {
            if (newTotal >= m && (newTotal - finalAmount) < m) {
                const { data: tokenRow } = await admin
                    .from('push_tokens')
                    .select('token')
                    .eq('user_id', userId)
                    .maybeSingle();

                if (tokenRow?.token) {
                    await sendExpoPushNotifications([{
                        to: tokenRow.token,
                        title: '🎉 XP Milestone!',
                        body: `You've reached ${m.toLocaleString()} XP!`,
                        data: { type: 'xp_milestone', milestone: m },
                    }]);
                }
                break;
            }
        }

        return jsonResponse({ newTotal, badgeUnlocked, badgeId, xpAwarded: finalAmount });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal error';
        return errorResponse(message, 500);
    }
});
