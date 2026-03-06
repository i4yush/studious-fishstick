import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';

interface BadgeUnlockProps {
    badgeName: string;
    isVisible: boolean;
    onComplete?: () => void;
}

export function BadgeUnlock({ badgeName, isVisible, onComplete }: BadgeUnlockProps) {
    if (!isVisible) return null;

    return (
        <View style={styles.overlay} pointerEvents="none">
            <LottieView
                // Place your badge-unlock.json in assets/lottie/
                source={require('../../assets/lottie/badge-unlock.json')}
                style={styles.lottie}
                autoPlay
                loop={false}
                onAnimationFinish={onComplete}
            />
            <Text style={styles.label}>🏅 {badgeName} Unlocked!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 1000,
    },
    lottie: {
        width: 220,
        height: 220,
    },
    label: {
        color: '#FFD700',
        fontSize: 22,
        fontWeight: '700',
        marginTop: 12,
        textAlign: 'center',
    },
});
