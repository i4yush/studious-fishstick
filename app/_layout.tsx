import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases from '@/lib/purchases';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useAuthStore } from '@/stores/useAuthStore';

// Prevent splash from auto-hiding until fonts are loaded
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
        },
    },
});

const persister = createAsyncStoragePersister({
    storage: AsyncStorage,
});

export default function RootLayout() {
    const initialize = useAuthStore((s) => s.initialize);

    const [fontsLoaded, fontError] = useFonts({
        'BebasNeue': require('@expo-google-fonts/bebas-neue/400Regular/BebasNeue_400Regular.ttf'),
        'Syne': require('@expo-google-fonts/syne/400Regular/Syne_400Regular.ttf'),
        'Syne-Bold': require('@expo-google-fonts/syne/700Bold/Syne_700Bold.ttf'),
        'SpaceMono': require('@expo-google-fonts/space-mono/400Regular/SpaceMono_400Regular.ttf'),
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    useEffect(() => {
        void initialize();

        // Configure RevenueCat (Native only)
        if (Platform.OS !== 'web') {
            const apiKey = Platform.select({
                ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS,
                android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID,
            });
            if (apiKey) {
                Purchases.configure({ apiKey });
            }
        }
    }, [initialize]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PersistQueryClientProvider
                client={queryClient}
                persistOptions={{ persister }}
            >
                <StatusBar style="light" />
                <Stack screenOptions={{ headerShown: false }} />
            </PersistQueryClientProvider>
        </GestureHandlerRootView>
    );
}
