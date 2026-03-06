import { supabase } from '@/supabase/client';
import type { Platform } from '@/supabase/types';

interface RegisterPushTokenParams {
    userId: string;
    token: string;
    platform: Platform;
}

export const notificationService = {
    registerPushToken: async (params: RegisterPushTokenParams): Promise<void> => {
        const { error } = await supabase.from('push_tokens').upsert(
            {
                user_id: params.userId,
                token: params.token,
                platform: params.platform,
                updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,platform' },
        );

        if (error) throw error;
    },

    markNotificationRead: async (notificationId: string): Promise<void> => {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId);

        if (error) throw error;
    },

    markAllRead: async (userId: string): Promise<void> => {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId)
            .eq('read', false);

        if (error) throw error;
    },
};
