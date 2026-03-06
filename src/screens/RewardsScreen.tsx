import React, { useState } from 'react';
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useRewardsQuery } from '@/queries/useRewardsQuery';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuthStore } from '@/stores/useAuthStore';
import { analyticsService } from '@/services/analyticsService';
import type { RewardTier } from '@/supabase/types';
import type { RewardRow } from '@/supabase/types';

const TABS: { label: string; value: RewardTier | undefined }[] = [
    { label: 'All', value: undefined },
    { label: 'Free', value: 'free' },
    { label: 'Premium', value: 'premium' },
];

export function RewardsScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<RewardTier | undefined>(undefined);
    const { data: rewards, isLoading } = useRewardsQuery(activeTab);
    const { data: sub } = useSubscription(user?.id);

    const handlePress = (reward: RewardRow) => {
        if (reward.tier === 'premium' && !sub?.isPremium) {
            // TODO: open paywall
            return;
        }
        analyticsService.leaderboardViewed('rewards');
        router.push(`/(app)/rewards/${reward.id}`);
    };

    return (
        <View style={styles.flex}>
            <Text style={styles.heading}>Rewards 🎁</Text>

            {/* Tabs */}
            <View style={styles.tabRow}>
                {TABS.map((tab) => (
                    <TouchableOpacity
                        key={tab.label}
                        style={[styles.tab, activeTab === tab.value && styles.tabActive]}
                        onPress={() => setActiveTab(tab.value)}
                    >
                        <Text style={[styles.tabText, activeTab === tab.value && styles.tabTextActive]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {isLoading ? (
                <ActivityIndicator color="#7C3AED" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={rewards ?? []}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => handlePress(item)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.cardRow}>
                                <View style={{ flex: 1, gap: 4 }}>
                                    <View style={styles.tierChip}>
                                        <Text style={styles.tierText}>{item.tier.toUpperCase()}</Text>
                                    </View>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                    <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                                </View>
                                <View style={styles.xpBadge}>
                                    <Text style={styles.xpText}>{item.xp_cost}</Text>
                                    <Text style={styles.xpLabel}>XP</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
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
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: '#1F1F1F',
    },
    tabActive: { backgroundColor: '#7C3AED' },
    tabText: { color: '#9CA3AF', fontWeight: '600', fontSize: 13 },
    tabTextActive: { color: '#fff' },
    list: { paddingHorizontal: 20, gap: 12, paddingBottom: 32 },
    card: {
        backgroundColor: '#1A1A2E',
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: '#2D2D4D',
    },
    cardRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
    tierChip: {
        alignSelf: 'flex-start',
        backgroundColor: '#2D1B69',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    tierText: { color: '#A78BFA', fontSize: 10, fontWeight: '700' },
    cardTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
    cardDesc: { color: '#6B7280', fontSize: 13, lineHeight: 18 },
    xpBadge: {
        backgroundColor: '#2D1B69',
        borderRadius: 14,
        padding: 12,
        alignItems: 'center',
        minWidth: 56,
    },
    xpText: { color: '#A78BFA', fontSize: 18, fontWeight: '800' },
    xpLabel: { color: '#7C3AED', fontSize: 11, fontWeight: '600' },
});
