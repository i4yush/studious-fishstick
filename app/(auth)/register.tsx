import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterScreen() {
    const router = useRouter();
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [busy, setBusy] = useState(false);

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

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.container}>
                <Text style={styles.heading}>Create account ✨</Text>
                <Text style={styles.subheading}>Start earning XP and climbing the ranks</Text>

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
                    <Text style={styles.btnText}>{busy ? 'Creating account…' : 'Create Account'}</Text>
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
    flex: { flex: 1, backgroundColor: '#0F0F0F' },
    container: { flex: 1, padding: 28, justifyContent: 'center', gap: 12 },
    heading: { color: '#fff', fontSize: 32, fontWeight: '800', marginBottom: 4 },
    subheading: { color: '#9CA3AF', fontSize: 15, marginBottom: 20 },
    input: {
        backgroundColor: '#1F1F1F',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#2D2D2D',
        color: '#fff',
        fontSize: 16,
        paddingHorizontal: 18,
        paddingVertical: 14,
    },
    btn: {
        backgroundColor: '#7C3AED',
        borderRadius: 14,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
    },
    btnDisabled: { opacity: 0.5 },
    btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    footerText: { color: '#9CA3AF', fontSize: 14 },
    link: { color: '#8B5CF6', fontSize: 14, fontWeight: '600' },
});
