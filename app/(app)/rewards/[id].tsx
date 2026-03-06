import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRewardDetailQuery } from '@/queries/useRewardsQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { useXP } from '@/hooks/useXP';
import { XPPopAnimation } from '@/animations/XPPopAnimation';
import { BadgeUnlock } from '@/animations/BadgeUnlock';
import { analyticsService } from '@/services/analyticsService';

export default function RewardDetailRoute() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuthStore();
    const { data: reward, isLoading } = useRewardDetailQuery(id);
    const { awardXP, isAnimating, pendingXPGain } = useXP();

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
                <Text style={styles.loading}>Loading…</Text>
            </View>
        );
    }

    if (!reward) {
        return (
            <View style={styles.center}>
                <Text style={styles.loading}>Reward not found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.flex}>
            <XPPopAnimation amount={pendingXPGain} isVisible={isAnimating} />
            <BadgeUnlock
                badgeName={badgeName}
                isVisible={badgeUnlocked}
                onComplete={() => { setBadgeUnlocked(false); router.back(); }}
            />
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                <TouchableOpacity onPress={() => router.back()} style={styles.back}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                <View style={styles.tierBadge}>
                    <Text style={styles.tierText}>{reward.tier.toUpperCase()}</Text>
                </View>

                <Text style={styles.title}>{reward.title}</Text>
                <Text style={styles.description}>{reward.description}</Text>

                <View style={styles.xpRow}>
                    <Text style={styles.xpLabel}>XP Cost</Text>
                    <Text style={styles.xpValue}>{reward.xp_cost} XP</Text>
                </View>

                <TouchableOpacity style={styles.btn} onPress={handleClaim} activeOpacity={0.85}>
                    <Text style={styles.btnText}>Claim Reward</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: '#0F0F0F' },
    scroll: { flex: 1 },
    content: { padding: 24, gap: 16 },
    center: { flex: 1, backgroundColor: '#0F0F0F', alignItems: 'center', justifyContent: 'center' },
    loading: { color: '#9CA3AF', fontSize: 16 },
    back: { marginBottom: 8 },
    backText: { color: '#7C3AED', fontSize: 15 },
    tierBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#2D1B69',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    tierText: { color: '#A78BFA', fontSize: 12, fontWeight: '700' },
    title: { color: '#fff', fontSize: 26, fontWeight: '800' },
    description: { color: '#9CA3AF', fontSize: 15, lineHeight: 22 },
    xpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#1F1F1F',
        borderRadius: 14,
        padding: 16,
    },
    xpLabel: { color: '#9CA3AF', fontSize: 14 },
    xpValue: { color: '#8B5CF6', fontSize: 16, fontWeight: '700' },
    btn: {
        backgroundColor: '#7C3AED',
        borderRadius: 14,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 16,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
    },
    btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
