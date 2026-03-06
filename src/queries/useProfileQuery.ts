import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';
import type { ProfileRow } from '@/supabase/types';

export const PROFILE_QUERY_KEY = (userId: string) => ['profile', userId] as const;

export function useProfileQuery(userId: string | undefined) {
    return useQuery<ProfileRow, Error>({
        queryKey: PROFILE_QUERY_KEY(userId ?? ''),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 min
        queryFn: async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, avatar_url, bio, created_at, updated_at')
                .eq('id', userId as string)
                .single();

            if (error) throw error;
            return data;
        },
    });
}
