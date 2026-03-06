import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileQuery } from '@/queries/useProfileQuery';
import { useUserBadgesQuery } from '@/queries/useBadgesQuery';
import { formatXP, xpTierName } from '@/utils/formatXP';
import { useXPStore } from '@/stores/useXPStore';

export function ProfileScreen() {
    const { user } = useAuthStore();
    const { data: profile, isLoading: profileLoading } = useProfileQuery(user?.id);
    const { data: userBadges, isLoading: badgesLoading } = useUserBadgesQuery(user?.id);
    const { displayXP } = useXPStore();

    if (profileLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color="#7C3AED" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
            {/* Avatar placeholder */}
            <View style={styles.avatarCircle}>
                <Text style={styles.avatarEmoji}>👤</Text>
            </View>

            <Text style={styles.username}>{profile?.username ?? 'Explorer'}</Text>
            <Text style={styles.tier}>{xpTierName(displayXP)}</Text>

            {/* XP Card */}
            <View style={styles.statRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{formatXP(displayXP)}</Text>
                    <Text style={styles.statLabel}>Total XP</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{userBadges?.length ?? 0}</Text>
                    <Text style={styles.statLabel}>Badges</Text>
                </View>
            </View>

            {/* Badges Section */}
            <Text style={styles.sectionTitle}>Badges</Text>
            {badgesLoading ? (
                <ActivityIndicator color="#7C3AED" />
            ) : (
                <View style={styles.badgeGrid}>
                    {(userBadges ?? []).map((ub) => (
                        <View key={ub.id} style={styles.badgeCard}>
                            <Text style={styles.badgeEmoji}>🏅</Text>
                            <Text style={styles.badgeName} numberOfLines={2}>
                                {ub.badges?.name ?? 'Badge'}
                            </Text>
                        </View>
                    ))}
                    {(userBadges ?? []).length === 0 && (
                        <Text style={styles.emptyText}>No badges yet. Keep earning XP!</Text>
                    )}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: '#0F0F0F' },
    content: { alignItems: 'center', padding: 24, gap: 16, paddingTop: 60 },
    center: { flex: 1, backgroundColor: '#0F0F0F', alignItems: 'center', justifyContent: 'center' },
    avatarCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#1F1F1F',
        borderWidth: 3,
        borderColor: '#7C3AED',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarEmoji: { fontSize: 40 },
    username: { color: '#fff', fontSize: 24, fontWeight: '800' },
    tier: { color: '#8B5CF6', fontSize: 14, fontWeight: '600' },
    statRow: { flexDirection: 'row', gap: 12, width: '100%' },
    statCard: {
        flex: 1,
        backgroundColor: '#1A1A2E',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        gap: 4,
        borderWidth: 1,
        borderColor: '#2D2D4D',
    },
    statValue: { color: '#fff', fontSize: 26, fontWeight: '900' },
    statLabel: { color: '#9CA3AF', fontSize: 12, fontWeight: '600' },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    badgeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        width: '100%',
    },
    badgeCard: {
        backgroundColor: '#1A1A2E',
        borderRadius: 14,
        padding: 14,
        alignItems: 'center',
        gap: 6,
        width: '30%',
        borderWidth: 1,
        borderColor: '#2D2D4D',
    },
    badgeEmoji: { fontSize: 28 },
    badgeName: { color: '#C4B5FD', fontSize: 11, fontWeight: '600', textAlign: 'center' },
    emptyText: { color: '#6B7280', fontSize: 14, textAlign: 'center', width: '100%' },
});
