import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { BRAND, FONT_DISPLAY } from '@/utils/constants';
import { springSnappy, ctaPressTiming } from '@/animations/transitions';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface CTAButtonProps {
    label?: string;
    onPress: () => void;
    style?: ViewStyle;
    disabled?: boolean;
}

export default function CTAButton({
    label = 'CLAIM YOUR TERRITORY',
    onPress,
    style,
    disabled = false,
}: CTAButtonProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withTiming(0.96, ctaPressTiming);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, springSnappy);
    };

    return (
        <AnimatedTouchable
            style={[styles.button, animatedStyle, style, disabled && styles.disabled]}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
            disabled={disabled}
        >
            <Text style={styles.label}>{label} ▶</Text>
        </AnimatedTouchable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: BRAND.SPRINT_RED,
        borderRadius: 4,
        paddingVertical: 18,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        shadowColor: BRAND.SPRINT_RED,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.55,
        shadowRadius: 20,
        elevation: 14,
    },
    label: {
        color: '#FFFFFF',
        fontFamily: FONT_DISPLAY,
        fontSize: 22,
        letterSpacing: 2,
    },
    disabled: {
        opacity: 0.5,
    },
});
