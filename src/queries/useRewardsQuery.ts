import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';

export const REWARDS_QUERY_KEY = (tier?: any) =>
    ['rewards', tier ?? 'all'] as const;

export function useRewardsQuery(tier?: any) {
    return useQuery<any[], Error>({
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
    return useQuery<any, Error>({
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
