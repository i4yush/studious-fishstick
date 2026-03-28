import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createAdminClient, jsonResponse, errorResponse } from '../_shared/supabaseAdmin.ts';
import { sendExpoPushNotifications } from '../_shared/pushNotification.ts';

interface UnlockBadgeBody {
    userId: string;
    totalXP: number;
}

Deno.serve(async (req: Request): Promise<Response> => {
    if (req.method !== 'POST') return errorResponse('Method not allowed', 405);

    try {
        const body = await req.json() as UnlockBadgeBody;
        const { userId, totalXP } = body;

        if (!userId) return errorResponse('userId is required');

        const admin = createAdminClient();

        // Fetch all badges the user doesn't yet have
        const { data: allBadges, error: badgesError } = await admin
            .from('badges')
            .select('id, name, condition_type, condition_value');

        if (badgesError) throw badgesError;

        const { data: userBadges } = await admin
            .from('user_badges')
            .select('badge_id')
            .eq('user_id', userId);

        const unlockedIds = new Set((userBadges ?? []).map((ub: { badge_id: string }) => ub.badge_id));
        const candidates = (allBadges ?? []).filter(
            (b: { id: string }) => !unlockedIds.has(b.id),
        );

        // Fetch supporting data
        const { data: streakRow } = await admin
            .from('streaks')
            .select('current_streak')
            .eq('user_id', userId)
            .maybeSingle();

        const { count: rewardClaimCount } = await admin
            .from('user_rewards')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId);

        const currentStreak = streakRow?.current_streak ?? 0;
        const claimedRewards = rewardClaimCount ?? 0;

        for (const badge of candidates as { id: string; name: string; condition_type: string; condition_value: number }[]) {
            let conditionMet = false;

            switch (badge.condition_type) {
                case 'xp_threshold':
                    conditionMet = totalXP >= badge.condition_value;
                    break;
                case 'streak_days':
                    conditionMet = currentStreak >= badge.condition_value;
                    break;
                case 'reward_claims':
                    conditionMet = claimedRewards >= badge.condition_value;
                    break;
                default:
                    break;
            }

            if (conditionMet) {
                // Insert user badge
                const { error: insertError } = await admin.from('user_badges').insert({
                    user_id: userId,
                    badge_id: badge.id,
                });

                if (insertError) continue; // Already unlocked — skip

                // Create in-app notification
                await admin.from('notifications').insert({
                    user_id: userId,
                    type: 'badge_unlocked',
                    title: '🏅 Badge Unlocked!',
                    body: `You earned the "${badge.name}" badge!`,
                });

                // Send push notification
                const { data: tokenRow } = await admin
                    .from('push_tokens')
                    .select('token')
                    .eq('user_id', userId)
                    .maybeSingle();

                if (tokenRow?.token) {
                    await sendExpoPushNotifications([{
                        to: tokenRow.token,
                        title: '🏅 Badge Unlocked!',
                        body: `You earned the "${badge.name}" badge!`,
                        data: { type: 'badge_unlocked', badge_id: badge.id },
                    }]);
                }

                return jsonResponse({ badgeUnlocked: true, badgeId: badge.id });
            }
        }

        return jsonResponse({ badgeUnlocked: false });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal error';
        return errorResponse(message, 500);
    }
});
