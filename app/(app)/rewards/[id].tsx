import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useRewardDetailQuery } from '@/queries/useRewardsQuery';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuthStore } from '@/stores/useAuthStore';
import { useXP } from '@/hooks/useXP';
import { XPPopAnimation } from '@/animations/XPPopAnimation';
import { BadgeUnlock } from '@/animations/BadgeUnlock';
import { analyticsService } from '@/services/analyticsService';
import { rewardService } from '@/services/rewardService';
import { BRAND, FONT_DISPLAY, FONT_BODY } from '@/utils/constants';

export default function RewardDetailRoute() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuthStore();
    const { data: reward, isLoading } = useRewardDetailQuery(id);
    const { data: sub } = useSubscription(user?.id);
    const { displayXP, awardXP, isAnimating, pendingXPGain } = useXP();

    const [badgeUnlocked, setBadgeUnlocked] = React.useState(false);
    const [badgeName, setBadgeName] = React.useState('');

    const handleClaim = async () => {
        if (!user || !reward) return;
        try {
            await rewardService.claimReward({
                userId: user.id,
                rewardId: reward.id,
            });
            analyticsService.rewardClaimed(reward.id, reward.tier);
            Alert.alert('Success', 'Reward claimed successfully!');
            router.back();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Could not claim reward. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <View style={styles.center}>
                <Text style={styles.loading}>LOADING…</Text>
            </View>
        );
    }

    if (!reward) {
        return (
            <View style={styles.center}>
                <Text style={styles.loading}>REWARD NOT FOUND</Text>
            </View>
        );
    }

    const isLockedByXP = reward.xp_cost > displayXP;
    const isLockedByPremium = reward.tier === 'premium' && !sub?.isPremium;
    const canClaim = !isLockedByXP && !isLockedByPremium;

    return (
        <View style={styles.flex}>
            <XPPopAnimation amount={pendingXPGain} isVisible={isAnimating} />
            <BadgeUnlock
                badgeName={badgeName}
                isVisible={badgeUnlocked}
                onComplete={() => { setBadgeUnlocked(false); router.back(); }}
            />
            <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <TouchableOpacity onPress={() => router.back()} style={styles.back} activeOpacity={0.8}>
                    <MaterialIcons name="arrow-back" size={24} color={BRAND.SPRINT_RED} />
                    <Text style={styles.backText}>BACK</Text>
                </TouchableOpacity>

                <View style={styles.heroContainer}>
                    {reward.image_url ? (
                        <Image 
                            source={{ uri: reward.image_url }} 
                            style={styles.heroImage} 
                            contentFit="cover" 
                        />
                    ) : (
                        <View style={styles.heroPlaceholder}>
                            <MaterialIcons name="card-giftcard" size={64} color={BRAND.MUTED} />
                        </View>
                    )}
                </View>

                <View style={[styles.tierBadge, reward.tier === 'premium' ? styles.tierPremium : styles.tierFree]}>
                    <Text style={[styles.tierText, reward.tier === 'premium' ? styles.tierTextPremium : styles.tierTextFree]}>
                        {reward.tier.toUpperCase()}
                    </Text>
                </View>

                <Text style={styles.title}>{reward.title}</Text>
                <Text style={styles.description}>{reward.description}</Text>

                <View style={styles.xpRow}>
                    <View>
                        <Text style={styles.xpLabel}>REQUIRED XP</Text>
                        <Text style={styles.xpValue}>{reward.xp_cost}</Text>
                    </View>
                    <View>
                        <Text style={styles.xpLabel}>YOUR XP</Text>
                        <Text style={[styles.xpValue, { color: isLockedByXP ? BRAND.MUTED : BRAND.RUNNR_LIME }]}>{displayXP}</Text>
                    </View>
                </View>

                <TouchableOpacity 
                    style={[
                        styles.btn, 
                        isLockedByPremium ? styles.btnPremiumLocked : (isLockedByXP ? styles.btnLocked : styles.btnUnlocked)
                    ]} 
                    onPress={canClaim ? handleClaim : undefined} 
                    activeOpacity={canClaim ? 0.85 : 1}
                >
                    <MaterialIcons 
                        name={isLockedByPremium ? "star" : (isLockedByXP ? "lock" : "check")} 
                        size={20} 
                        color={canClaim ? BRAND.VOID_BLACK : "#fff"} 
                        style={{ marginRight: 8 }} 
                    />
                    <Text style={[styles.btnText, canClaim && styles.btnTextUnlocked]}>
                        {isLockedByPremium ? 'REQUIRES PREMIUM' : (isLockedByXP ? 'INSUFFICIENT XP' : 'CLAIM REWARD')}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: BRAND.VOID_BLACK },
    content: { padding: 24, paddingBottom: 60, gap: 16 },
    center: { flex: 1, backgroundColor: BRAND.VOID_BLACK, alignItems: 'center', justifyContent: 'center' },
    loading: { color: BRAND.MUTED, fontSize: 18, fontFamily: FONT_DISPLAY, letterSpacing: 1 },
    back: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 40, gap: 4 },
    backText: { color: BRAND.SPRINT_RED, fontSize: 18, fontFamily: FONT_DISPLAY, letterSpacing: 1 },
    heroContainer: {
        width: '100%',
        aspectRatio: 1.2,
        backgroundColor: '#111',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: BRAND.MUTED,
        marginBottom: 8,
    },
    heroImage: { width: '100%', height: '100%' },
    heroPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    tierBadge: {
        alignSelf: 'flex-start',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    tierFree: { backgroundColor: 'rgba(200, 241, 53, 0.15)' },
    tierPremium: { backgroundColor: 'rgba(255, 77, 46, 0.15)' },
    tierText: { fontFamily: FONT_DISPLAY, fontSize: 14, letterSpacing: 1 },
    tierTextFree: { color: BRAND.RUNNR_LIME },
    tierTextPremium: { color: BRAND.SPRINT_RED },
    title: { color: '#fff', fontSize: 42, fontFamily: FONT_DISPLAY, letterSpacing: 1, lineHeight: 46 },
    description: { color: '#9CA3AF', fontSize: 16, fontFamily: FONT_BODY, lineHeight: 24, marginBottom: 8 },
    xpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: BRAND.SURFACE,
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: BRAND.MUTED,
        marginBottom: 8,
    },
    xpLabel: { color: '#9CA3AF', fontSize: 12, fontFamily: FONT_BODY, fontWeight: '700', marginBottom: 4 },
    xpValue: { color: '#FFF', fontSize: 24, fontFamily: FONT_DISPLAY, letterSpacing: 1 },
    btn: {
        flexDirection: 'row',
        borderRadius: 8,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    btnUnlocked: {
        backgroundColor: BRAND.RUNNR_LIME,
        shadowColor: BRAND.RUNNR_LIME,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    btnLocked: {
        backgroundColor: BRAND.MUTED,
    },
    btnPremiumLocked: {
        backgroundColor: BRAND.SPRINT_RED,
    },
    btnText: { color: '#fff', fontSize: 22, fontFamily: FONT_DISPLAY, letterSpacing: 1.5, marginTop: 2 },
    btnTextUnlocked: { color: BRAND.VOID_BLACK },
});
