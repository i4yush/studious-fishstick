import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LottieView from '@/components/common/LottieShim';

interface StreakFlameProps {
    isActive: boolean;
    size?: number;
}

export function StreakFlame({ isActive, size = 48 }: StreakFlameProps) {
    // Note: streak-flame.json is missing from assets/lottie/
    // Commenting out LottieView to prevent bundling error.
    return (
        <View style={[styles.lottie, { width: size, height: size, alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ fontSize: size * 0.6 }}>{isActive ? '🔥' : '⚪'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    lottie: {},
});
