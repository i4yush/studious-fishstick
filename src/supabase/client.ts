import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// ---------------------------------------------------------------------------
// SecureStore adapter so that Supabase Auth tokens are stored encrypted,
// never in AsyncStorage (which is plaintext).
// ---------------------------------------------------------------------------
import { Platform } from 'react-native';

// ---------------------------------------------------------------------------
// SecureStore adapter so that Supabase Auth tokens are stored encrypted on native,
// with a fallback to memory/localStorage on web.
// ---------------------------------------------------------------------------
const ExpoSecureStoreAdapter = {
    getItem: (key: string): Promise<string | null> => {
        if (Platform.OS === 'web') {
            if (typeof window !== 'undefined') {
                return Promise.resolve(window.localStorage.getItem(key));
            }
            return Promise.resolve(null);
        }
        return SecureStore.getItemAsync(key);
    },
    setItem: (key: string, value: string): Promise<void> => {
        if (Platform.OS === 'web') {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, value);
            }
            return Promise.resolve();
        }
        return SecureStore.setItemAsync(key, value);
    },
    removeItem: (key: string): Promise<void> => {
        if (Platform.OS === 'web') {
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
            }
            return Promise.resolve();
        }
        return SecureStore.deleteItemAsync(key);
    },
};

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
        auth: {
            storage: ExpoSecureStoreAdapter,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    },
);
