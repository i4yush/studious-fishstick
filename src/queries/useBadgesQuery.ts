import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';
import type { BadgeRow, UserBadgeRow } from '@/supabase/types';

export interface UserBadgeEntry extends UserBadgeRow {
    badges: BadgeRow | null;
}

export const BADGES_QUERY_KEY = ['badges'] as const;
export const USER_BADGES_QUERY_KEY = (userId: string) => ['user-badges', userId] as const;

export function useBadgesQuery() {
    return useQuery<BadgeRow[], Error>({
        queryKey: BADGES_QUERY_KEY,
        staleTime: 15 * 60 * 1000, // 15 min — badge definitions change rarely
        queryFn: async () => {
            const { data, error } = await supabase
                .from('badges')
                .select('id, name, icon_url, condition_type, condition_value, tier, created_at')
                .order('condition_value', { ascending: true });

            if (error) throw error;
            return data ?? [];
        },
    });
}

export function useUserBadgesQuery(userId: string | undefined) {
    return useQuery<UserBadgeEntry[], Error>({
        queryKey: USER_BADGES_QUERY_KEY(userId ?? ''),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('user_badges')
                .select('id, user_id, badge_id, unlocked_at, badges(id, name, icon_url, condition_type, condition_value, tier, created_at)')
                .eq('user_id', userId as string)
                .order('unlocked_at', { ascending: false });

            if (error) throw error;
            return (data ?? []) as UserBadgeEntry[];
        },
    });
}
