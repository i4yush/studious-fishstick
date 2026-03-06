import React, { useState } from 'react';
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useLeaderboardQuery } from '@/queries/useLeaderboardQuery';
import { analyticsService } from '@/services/analyticsService';
import { rankLabel, rankColour } from '@/utils/rankHelpers';
import { formatXP } from '@/utils/formatXP';
import type { LeaderboardPeriod } from '@/supabase/types';

const PERIODS: { label: string; value: LeaderboardPeriod }[] = [
    { label: 'Weekly', value: 'weekly' },
    { label: 'All-Time', value: 'alltime' },
];

export function LeaderboardScreen() {
    const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');
    const { data, isLoading, isFetching } = useLeaderboardQuery(period);

    const handlePeriodChange = (p: LeaderboardPeriod) => {
        setPeriod(p);
        analyticsService.leaderboardViewed(p);
    };

    return (
        <View style={styles.flex}>
            <Text style={styles.heading}>Leaderboard 🏆</Text>

            <View style={styles.tabRow}>
                {PERIODS.map((p) => (
                    <TouchableOpacity
                        key={p.value}
                        style={[styles.tab, period === p.value && styles.tabActive]}
                        onPress={() => handlePeriodChange(p.value)}
                    >
                        <Text style={[styles.tabText, period === p.value && styles.tabTextActive]}>
                            {p.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {isLoading ? (
                <ActivityIndicator color="#7C3AED" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={data ?? []}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    refreshing={isFetching}
                    renderItem={({ item }) => (
                        <View style={styles.row}>
                            <Text style={[styles.rank, { color: rankColour(item.rank) }]}>
                                {rankLabel(item.rank)}
                            </Text>
                            <View style={styles.userInfo}>
                                <Text style={styles.username}>
                                    {item.profiles?.username ?? 'Anonymous'}
                                </Text>
                            </View>
                            <Text style={styles.xp}>{formatXP(item.total_xp)} XP</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: '#0F0F0F', paddingTop: 60 },
    heading: { color: '#fff', fontSize: 28, fontWeight: '800', paddingHorizontal: 20, marginBottom: 16 },
    tabRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 16 },
    tab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#1F1F1F',
        alignItems: 'center',
    },
    tabActive: { backgroundColor: '#7C3AED' },
    tabText: { color: '#9CA3AF', fontWeight: '600', fontSize: 14 },
    tabTextActive: { color: '#fff' },
    list: { paddingHorizontal: 20, gap: 8, paddingBottom: 32 },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A2E',
        borderRadius: 14,
        padding: 14,
        gap: 12,
    },
    rank: { fontSize: 20, fontWeight: '800', width: 40, textAlign: 'center' },
    userInfo: { flex: 1 },
    username: { color: '#fff', fontSize: 15, fontWeight: '600' },
    xp: { color: '#8B5CF6', fontSize: 14, fontWeight: '700' },
});
