import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { MotiView } from 'moti';

interface XPPopAnimationProps {
    amount: number;
    isVisible: boolean;
    onAnimationComplete?: () => void;
}

export function XPPopAnimation({ amount, isVisible, onAnimationComplete }: XPPopAnimationProps) {
    if (!isVisible) return null;

    return (
        <MotiView
            from={{ opacity: 0, translateY: 0, scale: 0.5 }}
            animate={{ opacity: 1, translateY: -60, scale: 1.2 }}
            exit={{ opacity: 0, translateY: -100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            onDidAnimate={onAnimationComplete}
            style={styles.container}
            pointerEvents="none"
        >
            <Text style={styles.text}>+{amount} XP</Text>
        </MotiView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignSelf: 'center',
        top: '40%',
        zIndex: 999,
    },
    text: {
        color: '#8B5CF6',
        fontSize: 28,
        fontWeight: '800',
        textShadowColor: 'rgba(139, 92, 246, 0.6)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 12,
    },
});
