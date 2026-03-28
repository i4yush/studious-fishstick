import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createAdminClient, jsonResponse, errorResponse } from '../_shared/supabaseAdmin.ts';
import { sendExpoPushNotifications } from '../_shared/pushNotification.ts';

Deno.serve(async (req: Request): Promise<Response> => {
    if (req.method !== 'POST') return errorResponse('Method not allowed', 405);

    try {
        const admin = createAdminClient();

        // 1. Identify users who haven't had activity in the last 20-23 hours
        // and have a current streak > 0
        const twentyHoursAgo = new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString();

        const { data: atRiskUsers, error } = await admin
            .from('streaks')
            .select('user_id, current_streak, last_activity_at')
            .gt('current_streak', 0)
            .lt('last_activity_at', twentyHoursAgo);

        if (error) throw error;

        if (!atRiskUsers || atRiskUsers.length === 0) {
            return jsonResponse({ success: true, message: 'No users at risk today.' });
        }

        const notifications = [];

        for (const user of atRiskUsers) {
            // Fetch push token
            const { data: tokenRow } = await admin
                .from('push_tokens')
                .select('token')
                .eq('user_id', user.user_id)
                .maybeSingle();

            if (tokenRow?.token) {
                notifications.push({
                    to: tokenRow.token,
                    title: '🔥 Streak at Risk!',
                    body: `Don't lose your ${user.current_streak}-day streak! Complete an activity now.`,
                    data: { type: 'streak_risk' },
                });
            }

            // Also create in-app notification
            await admin.from('notifications').insert({
                user_id: user.user_id,
                type: 'streak_risk',
                title: '🔥 Streak at Risk!',
                body: `Your ${user.current_streak}-day streak expires soon. Stay active!`,
            });
        }

        if (notifications.length > 0) {
            await sendExpoPushNotifications(notifications);
        }

        return jsonResponse({ success: true, notifiedCount: notifications.length });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal error';
        return errorResponse(message, 500);
    }
});
