import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createRealtimeChannel } from '@/supabase/realtime';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { LEADERBOARD_QUERY_KEY } from '@/queries/useLeaderboardQuery';
import { NOTIFICATIONS_QUERY_KEY } from '@/queries/useNotificationsQuery';

interface UseRealtimeSyncOptions {
    userId: string | undefined;
}

/**
 * Subscribes to leaderboard and notifications Supabase Realtime channels.
 * On any change, invalidates the relevant TanStack Query caches so the UI
 * refetches automatically — avoiding manual socket payload merging.
 */
export function useRealtimeSync({ userId }: UseRealtimeSyncOptions): void {
    const queryClient = useQueryClient();
    const channelsRef = useRef<RealtimeChannel[]>([]);

    useEffect(() => {
        if (!userId) return;

        // Leaderboard channel
        const leaderboardChannel = createRealtimeChannel('leaderboard-changes', {
            table: 'leaderboard',
            event: 'UPDATE',
            onData: () => {
                void queryClient.invalidateQueries({ queryKey: LEADERBOARD_QUERY_KEY('weekly', 0) });
                void queryClient.invalidateQueries({ queryKey: LEADERBOARD_QUERY_KEY('alltime', 0) });
            },
        }).subscribe();

        // Notifications channel (filtered to current user)
        const notificationsChannel = createRealtimeChannel(`notifications-${userId}`, {
            table: 'notifications',
            event: 'INSERT',
            filter: `user_id=eq.${userId}`,
            onData: () => {
                void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY(userId) });
            },
        }).subscribe();

        channelsRef.current = [leaderboardChannel, notificationsChannel];

        return () => {
            channelsRef.current.forEach((ch) => {
                void ch.unsubscribe();
            });
            channelsRef.current = [];
        };
    }, [userId, queryClient]);
}
