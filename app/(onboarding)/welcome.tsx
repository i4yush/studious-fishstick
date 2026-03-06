import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { analyticsService } from '@/services/analyticsService';

export default function WelcomeScreen() {
    const router = useRouter();

    const handleContinue = () => {
        analyticsService.onboardingStepCompleted('welcome');
        router.push('/(onboarding)/permissions');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.emoji}>🚀</Text>
            <Text style={styles.title}>Welcome to{'\n'}PROJECT-RUN</Text>
            <Text style={styles.subtitle}>
                Earn XP, unlock badges, and climb the leaderboard.
                Every action counts.
            </Text>

            <TouchableOpacity style={styles.btn} onPress={handleContinue} activeOpacity={0.85}>
                <Text style={styles.btnText}>Get Started</Text>
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
    title: {
        color: '#fff',
        fontSize: 36,
        fontWeight: '900',
        textAlign: 'center',
        lineHeight: 44,
    },
    subtitle: {
        color: '#9CA3AF',
        fontSize: 16,
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
    btnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
