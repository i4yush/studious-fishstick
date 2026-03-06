import React from 'react';
import { StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

interface StreakFlameProps {
    isActive: boolean;
    size?: number;
}

export function StreakFlame({ isActive, size = 48 }: StreakFlameProps) {
    return (
        <LottieView
            // Place streak-flame.json in assets/lottie/
            source={require('../../assets/lottie/streak-flame.json')}
            style={[styles.lottie, { width: size, height: size }]}
            autoPlay={isActive}
            loop={isActive}
            speed={isActive ? 1 : 0}
        />
    );
}

const styles = StyleSheet.create({
    lottie: {},
});
