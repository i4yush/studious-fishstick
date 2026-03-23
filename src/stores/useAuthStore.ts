import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { supabase } from '@/supabase/client';

interface AuthState {
    session: Session | null;
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    // Actions
    setSession: (session: Session | null) => void;
    signOut: () => Promise<void>;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    user: null,
    isLoading: true,
    isAuthenticated: false,

    setSession: (session) =>
        set({
            session,
            user: session?.user ?? null,
            isAuthenticated: !!session,
            isLoading: false,
        }),

    signOut: async () => {
        await supabase.auth.signOut();
        set({ session: null, user: null, isAuthenticated: false });
    },

    /**
     * Called once in the root layout. Restores the persisted session
     * and subscribes to auth state changes for the app lifetime.
     */
    initialize: async () => {
        // Auth bypass for Expo Go
        if (Constants.appOwnership === 'expo') {
            console.warn('Auth Bypass Active: Mocking session in Expo Go');
            const mockUser: User = {
                id: 'mock-user-123',
                email: 'test@example.com',
                app_metadata: {},
                user_metadata: { full_name: 'Test User' },
                aud: 'authenticated',
                created_at: new Date().toISOString(),
            } as any;

            set({
                session: { user: mockUser, access_token: 'mock-token', refresh_token: 'mock-token' } as any,
                user: mockUser,
                isAuthenticated: true,
                isLoading: false,
            });
            return;
        }

        const { data } = await supabase.auth.getSession();
        set({
            session: data.session,
            user: data.session?.user ?? null,
            isAuthenticated: !!data.session,
            isLoading: false,
        });

        // Keep the store in sync for the lifetime of the app
        supabase.auth.onAuthStateChange((_event, session) => {
            if (Constants.appOwnership === 'expo') return; // Don't override mock

            set({
                session,
                user: session?.user ?? null,
                isAuthenticated: !!session,
                isLoading: false,
            });
        });
    },
}));
