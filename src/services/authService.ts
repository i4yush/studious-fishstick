import { supabase } from '@/supabase/client';

export const authService = {
    signIn: (email: string, password: string) =>
        supabase.auth.signInWithPassword({ email, password }),

    signUp: (email: string, password: string) =>
        supabase.auth.signUp({ email, password }),

    signOut: () => supabase.auth.signOut(),

    resetPassword: (email: string) =>
        supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'projectrun://reset-password',
        }),

    updatePassword: (newPassword: string) =>
        supabase.auth.updateUser({ password: newPassword }),

    getSession: () => supabase.auth.getSession(),

    getCurrentUser: () => supabase.auth.getUser(),

    signInWithGoogle: () =>
        supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: 'projectrun://auth/callback' },
        }),
};
