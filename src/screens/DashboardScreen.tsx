import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@/stores/useAuthStore';
import { useXPStore } from '@/stores/useXPStore';
import { useProfileQuery } from '@/queries/useProfileQuery';
import { StreakFlame } from '@/animations/StreakFlame';
import { XPPopAnimation } from '@/animations/XPPopAnimation';
import { formatXP, xpTierName } from '@/utils/formatXP';
import { useXP } from '@/hooks/useXP';

export function DashboardScreen() {
    const { user } = useAuthStore();
    const { data: profile } = useProfileQuery(user?.id);
    const { displayXP, isAnimating, pendingXPGain, awardXP } = useXP();
    const { isAnimating: xpAnimating } = useXPStore();

    const handleDailyLogin = async () => {
        if (!user) return;
        await awardXP({ userId: user.id, amount: 50, source: 'daily_login' });
    };

    return (
        <View style={styles.flex}>
            <XPPopAnimation amount={pendingXPGain} isVisible={isAnimating} />
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>
                            Hey, {profile?.username ?? 'Explorer'} 👋
                        </Text>
                        <Text style={styles.tier}>{xpTierName(displayXP)}</Text>
                    </View>
                    <StreakFlame isActive={true} size={40} />
                </View>

                {/* XP Card */}
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Total XP</Text>
                    <Text style={styles.xpValue}>{formatXP(displayXP)}</Text>
                    <View style={styles.xpBar}>
                        <View style={[styles.xpFill, { width: `${Math.min((displayXP % 500) / 5, 100)}%` }]} />
                    </View>
                    <Text style={styles.cardSub}>
                        {500 - (displayXP % 500)} XP to next tier
                    </Text>
                </View>

                {/* Quick Action */}
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={handleDailyLogin}
                    activeOpacity={0.85}
                    disabled={xpAnimating}
                >
                    <Text style={styles.actionEmoji}>⚡</Text>
                    <View>
                        <Text style={styles.actionTitle}>Daily Check-in</Text>
                        <Text style={styles.actionSub}>+50 XP</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: '#0F0F0F' },
    scroll: { flex: 1 },
    content: { padding: 20, gap: 16, paddingTop: 60 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    greeting: { color: '#fff', fontSize: 24, fontWeight: '800' },
    tier: { color: '#8B5CF6', fontSize: 13, fontWeight: '600', marginTop: 2 },
    card: {
        backgroundColor: '#1A1A2E',
        borderRadius: 20,
        padding: 22,
        borderWidth: 1,
        borderColor: '#2D2D4D',
        gap: 8,
    },
    cardLabel: { color: '#9CA3AF', fontSize: 13, fontWeight: '600' },
    xpValue: { color: '#fff', fontSize: 40, fontWeight: '900' },
    xpBar: {
        height: 8,
        backgroundColor: '#2D2D4D',
        borderRadius: 4,
        overflow: 'hidden',
    },
    xpFill: {
        height: '100%',
        backgroundColor: '#7C3AED',
        borderRadius: 4,
    },
    cardSub: { color: '#6B7280', fontSize: 12 },
    actionBtn: {
        backgroundColor: '#1A1A2E',
        borderRadius: 18,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        borderWidth: 1,
        borderColor: '#7C3AED',
    },
    actionEmoji: { fontSize: 28 },
    actionTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
    actionSub: { color: '#8B5CF6', fontSize: 13, fontWeight: '600' },
});
