import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/stores/useAuthStore';
import { supabase } from '@/supabase/client';
import { storageService } from '@/services/storageService';
import { analyticsService } from '@/services/analyticsService';

export default function ProfileSetupScreen() {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const [username, setUsername] = useState('');
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            setAvatarUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!username.trim() || !user) return;

        setBusy(true);
        try {
            let avatarUrl: string | null = null;

            if (avatarUri) {
                avatarUrl = await storageService.uploadAvatar(user.id, avatarUri);
            }

            const { error } = await supabase.from('profiles').update({
                username: username.trim(),
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
            }).eq('id', user.id);

            if (error) throw error;

            analyticsService.onboardingStepCompleted('profile_setup');
            router.replace('/(app)/dashboard');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Could not save profile.';
            Alert.alert('Error', message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Set up your profile</Text>
            <Text style={styles.subtitle}>This is how others will see you on the leaderboard</Text>

            <TouchableOpacity style={styles.avatarPicker} onPress={pickImage} activeOpacity={0.8}>
                {avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarPlaceholderText}>📷</Text>
                    </View>
                )}
                <Text style={styles.avatarLabel}>Choose Photo</Text>
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#555"
                maxLength={24}
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
            />

            <TouchableOpacity
                style={[styles.btn, (busy || !username.trim()) && styles.btnDisabled]}
                onPress={handleSave}
                disabled={busy || !username.trim()}
                activeOpacity={0.85}
            >
                <Text style={styles.btnText}>{busy ? 'Saving…' : 'Let\'s Go! 🚀'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F',
        padding: 28,
        justifyContent: 'center',
        gap: 16,
    },
    title: { color: '#fff', fontSize: 30, fontWeight: '800', textAlign: 'center' },
    subtitle: { color: '#9CA3AF', fontSize: 14, textAlign: 'center' },
    avatarPicker: { alignItems: 'center', gap: 8 },
    avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: '#7C3AED' },
    avatarPlaceholder: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#1F1F1F',
        borderWidth: 2,
        borderColor: '#7C3AED',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarPlaceholderText: { fontSize: 32 },
    avatarLabel: { color: '#7C3AED', fontSize: 14 },
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
    btnDisabled: { opacity: 0.4 },
    btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
