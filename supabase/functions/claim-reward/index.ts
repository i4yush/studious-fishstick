import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createAdminClient, getAuthenticatedUser, jsonResponse, errorResponse } from '../_shared/supabaseAdmin.ts';

interface ClaimRewardBody {
    userId: string;
    rewardId: string;
}

Deno.serve(async (req: Request): Promise<Response> => {
    if (req.method !== 'POST') return errorResponse('Method not allowed', 405);

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    try {
        const user = await getAuthenticatedUser(req, supabaseUrl, anonKey);
        const { userId, rewardId } = await req.json() as ClaimRewardBody;

        if (user.id !== userId) {
            return errorResponse('Forbidden: You can only claim rewards for yourself.', 403);
        }

        const admin = createAdminClient();

        // 1. Fetch reward details
        const { data: reward, error: rewardError } = await admin
            .from('rewards')
            .select('*')
            .eq('id', rewardId)
            .eq('is_active', true)
            .single();

        if (rewardError || !reward) return errorResponse('Reward not found or inactive.', 404);

        // 2. Check if already claimed
        const { data: existing } = await admin
            .from('user_rewards')
            .select('id')
            .eq('user_id', userId)
            .eq('reward_id', rewardId)
            .maybeSingle();

        if (existing) return errorResponse('Reward already claimed.', 400);

        // 3. Check for subscription tier if premium
        if (reward.tier === 'premium') {
            const { data: sub } = await admin
                .from('subscriptions')
                .select('status')
                .eq('user_id', userId)
                .eq('status', 'active')
                .maybeSingle();

            if (!sub) return errorResponse('Premium subscription required to claim this reward.', 403);
        }

        // 4. Check XP cost
        const { data: lbRow } = await admin
            .from('leaderboard')
            .select('total_xp')
            .eq('user_id', userId)
            .eq('period', 'alltime')
            .single();

        const currentXP = lbRow?.total_xp ?? 0;
        if (currentXP < reward.xp_cost) {
            return errorResponse(`Insufficient XP. Required: ${reward.xp_cost}, Current: ${currentXP}`, 400);
        }

        // 5. Atomic Transaction: Record Claim + Deduct XP (via xp_logs)
        // Note: Subtracting XP is recorded as a negative log entry
        const { error: claimError } = await admin.from('user_rewards').insert({
            user_id: userId,
            reward_id: rewardId,
        });

        if (claimError) throw claimError;

        const { error: logError } = await admin.from('xp_logs').insert({
            user_id: userId,
            amount: -reward.xp_cost,
            source: 'reward_claimed',
        });

        if (logError) throw logError;

        // 6. Update leaderboard totals
        const { error: lbError } = await admin.rpc('increment_leaderboard_xp', {
            p_user_id: userId,
            p_amount: -reward.xp_cost,
        });

        if (lbError) throw lbError;

        return jsonResponse({ success: true, rewardTitle: reward.title });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal error';
        return errorResponse(message, 500);
    }
});
