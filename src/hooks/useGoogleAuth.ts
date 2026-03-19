import { useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@/supabase/client';
import { useAuthStore } from '@/stores/useAuthStore';

// Required: completes the auth session when the app is resumed from browser
WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
    const setSession = useAuthStore((s) => s.setSession);
    const [isExchanging, setIsExchanging] = useState(false);

    const [request, , promptAsyncOrig] = Google.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        redirectUri: makeRedirectUri({
            scheme: 'projectrun',
            path: 'auth/callback',
        }),
    });

    const promptAsync = async () => {
        try {
            setIsExchanging(true);
            const result = await promptAsyncOrig();
            
            if (result.type === 'success') {
                const { id_token } = result.params;
                if (id_token) {
                    const { data, error } = await supabase.auth.signInWithIdToken({ 
                        provider: 'google', 
                        token: id_token 
                    });
                    
                    if (error) throw error;
                    if (data.session) {
                        setSession(data.session);
                        return { type: 'success' };
                    }
                }
                throw new Error('Google sign-in incomplete.');
            }
            
            return { type: result.type };
        } catch (error) {
            throw error;
        } finally {
            setIsExchanging(false);
        }
    };

    return {
        promptAsync,
        isLoading: !request || isExchanging,
    };
}
