import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
        },
    },
});

export default function RootLayout() {
    const initialize = useAuthStore((s) => s.initialize);

    useEffect(() => {
        void initialize();
    }, [initialize]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
                <StatusBar style="light" />
                <Stack screenOptions={{ headerShown: false }} />
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
}
