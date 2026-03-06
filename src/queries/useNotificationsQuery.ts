import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';
import type { NotificationRow } from '@/supabase/types';

export const NOTIFICATIONS_QUERY_KEY = (userId: string) =>
    ['notifications', userId] as const;

export function useNotificationsQuery(userId: string | undefined) {
    return useQuery<NotificationRow[], Error>({
        queryKey: NOTIFICATIONS_QUERY_KEY(userId ?? ''),
        enabled: !!userId,
        staleTime: 30_000, // 30s — notifications should feel live
        queryFn: async () => {
            const { data, error } = await supabase
                .from('notifications')
                .select('id, user_id, type, title, body, read, created_at')
                .eq('user_id', userId as string)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            return data ?? [];
        },
    });
}

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, { notificationId: string; userId: string }>({
        mutationFn: async ({ notificationId }) => {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', notificationId);

            if (error) throw error;
        },
        onSuccess: (_data, { userId }) => {
            void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY(userId) });
        },
    });
}
