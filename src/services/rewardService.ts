import { supabase } from '@/supabase/client';
import type { XPSource } from '@/supabase/types';

const EDGE_BASE = process.env.EXPO_PUBLIC_SUPABASE_URL + '/functions/v1';

interface AwardXPPayload {
    userId: string;
    amount: number;
    source: XPSource;
}

interface AwardXPResult {
    newTotal: number;
    badgeUnlocked: boolean;
    badgeId?: string;
}

interface ClaimRewardPayload {
    userId: string;
    rewardId: string;
}

async function callEdgeFunction<T>(
    functionName: string,
    payload: Record<string, unknown>,
): Promise<T> {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
    const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

    const response = await fetch(`${EDGE_BASE}/${functionName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'apikey': anonKey,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Edge function ${functionName} failed: ${text}`);
    }

    return response.json() as Promise<T>;
}

export const rewardService = {
    awardXP: (payload: AwardXPPayload): Promise<AwardXPResult> =>
        callEdgeFunction<AwardXPResult>('award-xp', payload),

    claimReward: (payload: ClaimRewardPayload): Promise<{ success: boolean }> =>
        callEdgeFunction<{ success: boolean }>('claim-reward', payload),
};
