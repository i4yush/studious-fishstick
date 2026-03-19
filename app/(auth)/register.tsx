import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '@/hooks/useAuth';
import { BRAND, FONT_DISPLAY, FONT_BODY } from '@/utils/constants';

export default function RegisterScreen() {
    const router = useRouter();
    const { signUp, signInWithGoogle, isGoogleLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        WebBrowser.warmUpAsync();
        return () => {
            WebBrowser.coolDownAsync();
        };
    }, []);

    const handleRegister = async () => {
        if (!email || !password) {
            Alert.alert('Missing fields', 'Please fill in all fields.');
            return;
        }
        if (password !== confirm) {
            Alert.alert('Password mismatch', 'Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            Alert.alert('Weak password', 'Password must be at least 8 characters.');
            return;
        }
        try {
            setBusy(true);
            await signUp(email.trim().toLowerCase(), password);
            router.replace('/(onboarding)/welcome');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Registration failed.';
            Alert.alert('Error', message);
        } finally {
            setBusy(false);
        }
    };

    const handleGoogleRegister = async () => {
        if (isGoogleLoading) return;
        try {
            const result = await signInWithGoogle();
            if (result?.type === 'success') {
                router.replace('/(onboarding)/welcome');
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Google sign-up failed. Please try again.';
            Alert.alert('Registration failed', message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.container}>
                <Text style={styles.eyebrow}>JOIN THE MOVEMENT</Text>
                <Text style={styles.heading}>CREATE{'\n'}ACCOUNT</Text>
                <Text style={styles.subheading}>Start capturing blocks and climb the ranks</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#555"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#555"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#555"
                    secureTextEntry
                    value={confirm}
                    onChangeText={setConfirm}
                />

                <TouchableOpacity
                    style={[styles.btn, busy && styles.btnDisabled]}
                    onPress={handleRegister}
                    disabled={busy}
                    activeOpacity={0.8}
                >
                    <Text style={styles.btnText}>{busy ? 'CREATING ACCOUNT…' : 'CREATE ACCOUNT ▶'}</Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                    style={[styles.googleBtn, isGoogleLoading && styles.btnDisabled]}
                    onPress={handleGoogleRegister}
                    disabled={isGoogleLoading}
                    activeOpacity={0.8}
                >
                    <Text style={styles.googleBtnText}>
                        {isGoogleLoading ? 'WAIT…' : 'CONTINUE WITH GOOGLE'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <Link href="/(auth)/login" style={styles.link}>Sign In</Link>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: BRAND.VOID_BLACK },
    container: { flex: 1, padding: 28, justifyContent: 'center', gap: 12 },
    eyebrow: {
        color: BRAND.SPRINT_RED,
        fontFamily: FONT_DISPLAY,
        fontSize: 13,
        letterSpacing: 3,
    },
    heading: {
        color: '#fff',
        fontFamily: FONT_DISPLAY,
        fontSize: 48,
        lineHeight: 50,
        marginBottom: 4,
    },
    subheading: {
        color: '#9CA3AF',
        fontFamily: FONT_BODY,
        fontSize: 15,
        marginBottom: 16,
    },
    input: {
        backgroundColor: BRAND.SURFACE,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: BRAND.MUTED,
        color: '#fff',
        fontFamily: FONT_BODY,
        fontSize: 16,
        paddingHorizontal: 18,
        paddingVertical: 14,
    },
    btn: {
        backgroundColor: BRAND.SPRINT_RED,
        borderRadius: 4,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: BRAND.SPRINT_RED,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.55,
        shadowRadius: 20,
        elevation: 14,
    },
    googleBtn: {
        backgroundColor: '#fff',
        borderRadius: 4,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 0,
    },
    googleBtnText: {
        color: '#000',
        fontFamily: FONT_DISPLAY,
        fontSize: 18,
        letterSpacing: 1,
    },
    btnDisabled: { opacity: 0.5 },
    btnText: {
        color: '#fff',
        fontFamily: FONT_DISPLAY,
        fontSize: 20,
        letterSpacing: 2,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: BRAND.MUTED,
    },
    dividerText: {
        color: '#9CA3AF',
        fontFamily: FONT_BODY,
        paddingHorizontal: 16,
        fontSize: 14,
    },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
    footerText: { color: BRAND.MUTED, fontFamily: FONT_BODY, fontSize: 14 },
    link: { color: BRAND.SPRINT_RED, fontFamily: FONT_BODY, fontSize: 14, fontWeight: '600' },
});
