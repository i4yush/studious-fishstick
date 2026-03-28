import React, { useState } from 'react';
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useRewardsQuery } from '@/queries/useRewardsQuery';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuthStore } from '@/stores/useAuthStore';
import { analyticsService } from '@/services/analyticsService';
import { useXP } from '@/hooks/useXP';
import { BRAND, FONT_DISPLAY, FONT_BODY } from '@/utils/constants';
import type { RewardTier, RewardRow } from '@/supabase/types';

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
    const { displayXP } = useXP();

    const handlePress = (reward: RewardRow) => {
        analyticsService.leaderboardViewed('rewards');
        router.push(`/(app)/rewards/${reward.id}`);
    };

    return (
        <View style={styles.flex}>
            <Text style={styles.heading}>REWARDS</Text>

            {/* Tabs */}
            <View style={styles.tabRow}>
                {TABS.map((tab) => (
                    <TouchableOpacity
                        key={tab.label}
                        style={[
                            styles.tab, 
                            activeTab === tab.value && (tab.value === 'premium' ? styles.tabActivePremium : styles.tabActive)
                        ]}
                        onPress={() => setActiveTab(tab.value)}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.tabText, activeTab === tab.value && styles.tabTextActive]}>
                            {tab.label.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {isLoading ? (
                <ActivityIndicator color={BRAND.SPRINT_RED} style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={rewards ?? []}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const isLocked = item.xp_cost > displayXP;
                        const isPremiumLocked = item.tier === 'premium' && !sub?.isPremium;
                        const isUnavailable = isLocked || isPremiumLocked;

                        return (
                            <TouchableOpacity
                                style={[styles.card, isUnavailable && styles.cardLocked]}
                                onPress={() => handlePress(item)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.cardRow}>
                                    <View style={styles.imageContainer}>
                                        {item.image_url ? (
                                            <Image 
                                                source={{ uri: item.image_url }} 
                                                style={[styles.image, isUnavailable && styles.imageLocked]} 
                                                contentFit="cover" 
                                            />
                                        ) : (
                                            <View style={[styles.imagePlaceholder, isUnavailable && styles.imageLocked]}>
                                                <MaterialIcons name="card-giftcard" size={28} color={BRAND.MUTED} />
                                            </View>
                                        )}
                                        {isUnavailable && (
                                            <View style={styles.lockOverlay}>
                                                <MaterialIcons name={isPremiumLocked ? "star" : "lock"} size={24} color={isPremiumLocked ? BRAND.SPRINT_RED : "#FFF"} />
                                            </View>
                                        )}
                                    </View>
                                    <View style={{ flex: 1, gap: 4 }}>
                                        <View style={[styles.tierChip, item.tier === 'premium' ? styles.tierPremium : styles.tierFree]}>
                                            <Text style={[styles.tierText, item.tier === 'premium' ? styles.tierTextPremium : styles.tierTextFree]}>
                                                {item.tier.toUpperCase()}
                                            </Text>
                                        </View>
                                        <Text style={styles.cardTitle}>{item.title}</Text>
                                        <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                                    </View>
                                    <View style={[styles.xpBadge, isLocked ? styles.xpBadgeLocked : styles.xpBadgeUnlocked]}>
                                        <Text style={[styles.xpText, isLocked ? styles.xpTextLocked : styles.xpTextUnlocked]}>
                                            {item.xp_cost}
                                        </Text>
                                        <Text style={[styles.xpLabel, isLocked ? styles.xpTextLocked : styles.xpTextUnlocked]}>XP</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: BRAND.VOID_BLACK, paddingTop: 60 },
    heading: { 
        color: '#fff', 
        fontSize: 36, 
        fontFamily: FONT_DISPLAY,
        paddingHorizontal: 20, 
        marginBottom: 16,
        letterSpacing: 1
    },
    tabRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 20 },
    tab: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 4,
        backgroundColor: BRAND.SURFACE,
        borderWidth: 1,
        borderColor: BRAND.MUTED,
    },
    tabActive: { backgroundColor: BRAND.RUNNR_LIME, borderColor: BRAND.RUNNR_LIME },
    tabActivePremium: { backgroundColor: BRAND.SPRINT_RED, borderColor: BRAND.SPRINT_RED },
    tabText: { color: '#9CA3AF', fontFamily: FONT_BODY, fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
    tabTextActive: { color: BRAND.VOID_BLACK },
    list: { paddingHorizontal: 20, gap: 16, paddingBottom: 40 },
    card: {
        backgroundColor: BRAND.SURFACE,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: BRAND.MUTED,
    },
    cardLocked: {
        opacity: 0.75,
        borderColor: '#222',
        backgroundColor: '#0c0c0c',
    },
    cardRow: { flexDirection: 'row', gap: 16, alignItems: 'center' },
    imageContainer: {
        width: 72,
        height: 72,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: { width: '100%', height: '100%' },
    imagePlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    imageLocked: { opacity: 0.3 },
    lockOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    tierChip: {
        alignSelf: 'flex-start',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 3,
    },
    tierFree: { backgroundColor: 'rgba(200, 241, 53, 0.15)' },
    tierPremium: { backgroundColor: 'rgba(255, 77, 46, 0.15)' },
    tierText: { fontFamily: FONT_DISPLAY, fontSize: 12, letterSpacing: 1 },
    tierTextFree: { color: BRAND.RUNNR_LIME },
    tierTextPremium: { color: BRAND.SPRINT_RED },
    cardTitle: { color: '#fff', fontSize: 18, fontFamily: FONT_DISPLAY, letterSpacing: 0.5 },
    cardDesc: { color: '#9CA3AF', fontSize: 14, fontFamily: FONT_BODY, lineHeight: 20 },
    xpBadge: {
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        minWidth: 50,
        justifyContent: 'center',
        borderWidth: 1,
    },
    xpBadgeUnlocked: { backgroundColor: 'rgba(200, 241, 53, 0.1)', borderColor: 'rgba(200, 241, 53, 0.3)' },
    xpBadgeLocked: { backgroundColor: BRAND.VOID_BLACK, borderColor: BRAND.MUTED },
    xpText: { fontSize: 20, fontFamily: FONT_DISPLAY },
    xpTextUnlocked: { color: BRAND.RUNNR_LIME },
    xpTextLocked: { color: '#6B7280' },
    xpLabel: { fontSize: 10, fontFamily: FONT_BODY, fontWeight: '700' },
});
