import { useCallback } from 'react';
import { useXPStore } from '@/stores/useXPStore';
import { rewardService } from '@/services/rewardService';
import type { XPSource } from '@/supabase/types';

interface AwardXPParams {
    userId: string;
    amount: number;
    source: XPSource;
}

interface AwardXPResult {
    newTotal: number;
    badgeUnlocked: boolean;
    badgeId?: string;
}

export function useXP() {
    const { displayXP, isAnimating, pendingXPGain, addOptimisticXP, confirmXP, rollbackXP } =
        useXPStore();

    const awardXP = useCallback(
        async ({ userId, amount, source }: AwardXPParams): Promise<AwardXPResult> => {
            const previousXP = displayXP;

            // 1. Optimistic update — animate immediately
            addOptimisticXP(amount);

            try {
                // 2. Server call via Edge Function
                const result = await rewardService.awardXP({ userId, amount, source });

                // 3. Confirm with server total
                confirmXP(result.newTotal);

                return result;
            } catch (error) {
                // 4. Rollback on failure
                rollbackXP(previousXP);
                throw error;
            }
        },
        [displayXP, addOptimisticXP, confirmXP, rollbackXP],
    );

    return {
        displayXP,
        isAnimating,
        pendingXPGain,
        awardXP,
    };
}
