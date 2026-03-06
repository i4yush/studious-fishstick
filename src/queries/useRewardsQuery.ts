import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';
import type { RewardRow, RewardTier } from '@/supabase/types';

export const REWARDS_QUERY_KEY = (tier?: RewardTier) =>
    ['rewards', tier ?? 'all'] as const;

export function useRewardsQuery(tier?: RewardTier) {
    return useQuery<RewardRow[], Error>({
        queryKey: REWARDS_QUERY_KEY(tier),
        staleTime: 10 * 60 * 1000, // 10 min — catalog changes rarely
        queryFn: async () => {
            let query = supabase
                .from('rewards')
                .select('id, title, description, xp_cost, tier, is_active, image_url, created_at, updated_at')
                .eq('is_active', true)
                .order('xp_cost', { ascending: true });

            if (tier) {
                query = query.eq('tier', tier);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data ?? [];
        },
    });
}

export function useRewardDetailQuery(rewardId: string | undefined) {
    return useQuery<RewardRow, Error>({
        queryKey: ['reward', rewardId],
        enabled: !!rewardId,
        staleTime: 10 * 60 * 1000,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('rewards')
                .select('id, title, description, xp_cost, tier, is_active, image_url, created_at, updated_at')
                .eq('id', rewardId as string)
                .single();

            if (error) throw error;
            return data;
        },
    });
}
