import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [busy, setBusy] = useState(false);
    const [sent, setSent] = useState(false);

    const handleReset = async () => {
        if (!email) {
            Alert.alert('Missing field', 'Please enter your email address.');
            return;
        }
        try {
            setBusy(true);
            await resetPassword(email.trim().toLowerCase());
            setSent(true);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Could not send reset email.';
            Alert.alert('Error', message);
        } finally {
            setBusy(false);
        }
    };

    if (sent) {
        return (
            <View style={[styles.container, styles.successContainer]}>
                <Text style={styles.emoji}>📧</Text>
                <Text style={styles.heading}>Check your inbox</Text>
                <Text style={styles.subheading}>
                    We sent a password reset link to {email}
                </Text>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => router.back()}
                    activeOpacity={0.8}
                >
                    <Text style={styles.btnText}>Back to Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.container}>
                <TouchableOpacity onPress={() => router.back()} style={styles.back}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                <Text style={styles.heading}>Reset password 🔑</Text>
                <Text style={styles.subheading}>
                    Enter your email and we'll send you a reset link
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#555"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <TouchableOpacity
                    style={[styles.btn, busy && styles.btnDisabled]}
                    onPress={handleReset}
                    disabled={busy}
                    activeOpacity={0.8}
                >
                    <Text style={styles.btnText}>{busy ? 'Sending…' : 'Send Reset Link'}</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: '#0F0F0F' },
    container: { flex: 1, padding: 28, justifyContent: 'center', gap: 12 },
    successContainer: { alignItems: 'center' },
    emoji: { fontSize: 64, marginBottom: 12 },
    back: { marginBottom: 24 },
    backText: { color: '#7C3AED', fontSize: 15 },
    heading: { color: '#fff', fontSize: 30, fontWeight: '800', marginBottom: 4 },
    subheading: { color: '#9CA3AF', fontSize: 15, marginBottom: 20, textAlign: 'center' },
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
});
