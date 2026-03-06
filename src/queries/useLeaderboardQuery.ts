import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';
import type { LeaderboardRow, LeaderboardPeriod } from '@/supabase/types';

export interface LeaderboardEntry extends LeaderboardRow {
    profiles: { username: string | null; avatar_url: string | null } | null;
}

export const LEADERBOARD_QUERY_KEY = (period: LeaderboardPeriod, page: number) =>
    ['leaderboard', period, page] as const;

const PAGE_SIZE = 20;

export function useLeaderboardQuery(period: LeaderboardPeriod, page = 0) {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const staleTime = period === 'weekly' ? 30_000 : 60_000; // 30s / 60s

    return useQuery<LeaderboardEntry[], Error>({
        queryKey: LEADERBOARD_QUERY_KEY(period, page),
        staleTime,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('leaderboard')
                .select('id, user_id, total_xp, rank, period, updated_at, profiles(username, avatar_url)')
                .eq('period', period)
                .order('rank', { ascending: true })
                .range(from, to);

            if (error) throw error;
            return (data ?? []) as LeaderboardEntry[];
        },
    });
}
