import { useCallback } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { authService } from '@/services/authService';

export function useAuth() {
    const { session, user, isLoading, isAuthenticated, setSession, signOut } =
        useAuthStore();

    const handleSignIn = useCallback(
        async (email: string, password: string) => {
            const { data, error } = await authService.signIn(email, password);
            if (error) throw error;
            if (data.session) setSession(data.session);
        },
        [setSession],
    );

    const handleSignUp = useCallback(
        async (email: string, password: string) => {
            const { data, error } = await authService.signUp(email, password);
            if (error) throw error;
            if (data.session) setSession(data.session);
        },
        [setSession],
    );

    const handleSignOut = useCallback(async () => {
        await signOut();
    }, [signOut]);

    const handleResetPassword = useCallback(async (email: string) => {
        const { error } = await authService.resetPassword(email);
        if (error) throw error;
    }, []);

    return {
        session,
        user,
        isLoading,
        isAuthenticated,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        resetPassword: handleResetPassword,
    };
}
