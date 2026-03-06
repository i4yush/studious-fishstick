import React, { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { useNotifications } from '@/hooks/useNotifications';
import { Text } from 'react-native';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
    return (
        <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
    );
}

export default function AppLayout() {
    const router = useRouter();
    const { isAuthenticated, isLoading, user } = useAuthStore();

    // Auth guard
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/(auth)/login');
        }
    }, [isAuthenticated, isLoading, router]);

    // Setup realtime sync + push notifications
    useRealtimeSync({ userId: user?.id });
    useNotifications({ userId: user?.id });

    if (!isAuthenticated) return null;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#0F0F0F',
                    borderTopColor: '#1F1F1F',
                    height: 72,
                    paddingBottom: 12,
                },
                tabBarActiveTintColor: '#8B5CF6',
                tabBarInactiveTintColor: '#6B7280',
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
            }}
        >
            <Tabs.Screen
                name="dashboard/index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="rewards/index"
                options={{
                    title: 'Rewards',
                    tabBarIcon: ({ focused }) => <TabIcon emoji="🎁" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="leaderboard/index"
                options={{
                    title: 'Rankings',
                    tabBarIcon: ({ focused }) => <TabIcon emoji="🏆" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="profile/index"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="settings/index"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} />,
                }}
            />
            {/* Hide the reward detail route from tab bar */}
            <Tabs.Screen name="rewards/[id]" options={{ href: null }} />
        </Tabs>
    );
}
