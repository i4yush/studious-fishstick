import { useEffect, useRef } from 'react';
import * as ExpoNotifications from 'expo-notifications';
import { Platform } from 'react-native';
import { notificationService } from '@/services/notificationService';

ExpoNotifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

interface UseNotificationsOptions {
    userId: string | undefined;
}

export function useNotifications({ userId }: UseNotificationsOptions) {
    const listenerRef = useRef<ExpoNotifications.EventSubscription | null>(null);
    const responseListenerRef = useRef<ExpoNotifications.EventSubscription | null>(null);

    useEffect(() => {
        if (!userId) return;

        const setup = async () => {
            // 1. Request permission
            const { status } = await ExpoNotifications.requestPermissionsAsync();
            if (status !== 'granted') return;

            // 2. Get push token
            const tokenData = await ExpoNotifications.getExpoPushTokenAsync({
                projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID ?? '',
            });

            // 3. Upsert token in DB
            await notificationService.registerPushToken({
                userId,
                token: tokenData.data,
                platform: Platform.OS === 'ios' ? 'ios' : 'android',
            });
        };

        void setup();

        // Foreground notification listener
        listenerRef.current =
            ExpoNotifications.addNotificationReceivedListener((notification) => {
                console.log('Foreground notification:', notification);
            });

        // Response listener (tap on notification)
        responseListenerRef.current =
            ExpoNotifications.addNotificationResponseReceivedListener((response) => {
                console.log('Notification tapped:', response);
            });

        return () => {
            listenerRef.current?.remove();
            responseListenerRef.current?.remove();
        };
    }, [userId]);
}
