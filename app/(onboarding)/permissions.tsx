import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ExpoNotifications from 'expo-notifications';
import { analyticsService } from '@/services/analyticsService';

export default function PermissionsScreen() {
    const router = useRouter();

    const handleAllow = async () => {
        const { status } = await ExpoNotifications.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Notifications disabled',
                'You can enable notifications later in Settings.',
            );
        }
        analyticsService.onboardingStepCompleted('permissions');
        router.push('/(onboarding)/profile-setup');
    };

    const handleSkip = () => {
        analyticsService.onboardingStepCompleted('permissions_skipped');
        router.push('/(onboarding)/profile-setup');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.emoji}>🔔</Text>
            <Text style={styles.title}>Stay in the loop</Text>
            <Text style={styles.subtitle}>
                Enable notifications to get streak reminders, badge unlocks,
                and leaderboard updates.
            </Text>

            <TouchableOpacity style={styles.btn} onPress={handleAllow} activeOpacity={0.85}>
                <Text style={styles.btnText}>Allow Notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSkip} style={styles.skip}>
                <Text style={styles.skipText}>Not now</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        gap: 20,
    },
    emoji: { fontSize: 80 },
    title: { color: '#fff', fontSize: 32, fontWeight: '800', textAlign: 'center' },
    subtitle: {
        color: '#9CA3AF',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 24,
    },
    btn: {
        width: '100%',
        backgroundColor: '#7C3AED',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 16,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 10,
    },
    btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
    skip: { marginTop: 8 },
    skipText: { color: '#6B7280', fontSize: 14 },
});
