import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
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
        const { data } = await supabase.auth.getSession();
        set({
            session: data.session,
            user: data.session?.user ?? null,
            isAuthenticated: !!data.session,
            isLoading: false,
        });

        // Keep the store in sync for the lifetime of the app
        supabase.auth.onAuthStateChange((_event, session) => {
            set({
                session,
                user: session?.user ?? null,
                isAuthenticated: !!session,
                isLoading: false,
            });
        });
    },
}));
