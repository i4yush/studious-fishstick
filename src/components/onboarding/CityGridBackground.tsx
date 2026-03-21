import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withRepeat,
    withTiming,
    withSequence,
} from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';
import { BRAND } from '@/utils/constants';

const AnimatedLine = Animated.createAnimatedComponent(Line);

const COLUMNS = 10;
const ROWS = 16;

// A single animated grid line using shared opacity
function GridLine({ x1, y1, x2, y2, opacity }: {
    x1: string; y1: string; x2: string; y2: string;
    opacity: Animated.SharedValue<number>;
}) {
    const animatedProps = useAnimatedProps(() => ({
        opacity: opacity.value,
    }));
    return (
        <AnimatedLine
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={BRAND.SPRINT_RED}
            strokeWidth="0.5"
            animatedProps={animatedProps}
        />
    );
}

export default function CityGridBackground() {
    const opacity = useSharedValue(0.06);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.14, { duration: 1500 }),
                withTiming(0.06, { duration: 1500 }),
            ),
            -1,
            false,
        );
    }, []);

    // Build column lines
    const colLines = Array.from({ length: COLUMNS + 1 }, (_, i) => {
        const pct = `${(i / COLUMNS) * 100}%`;
        return (
            <GridLine key={`col-${i}`} x1={pct} y1="0%" x2={pct} y2="100%" opacity={opacity} />
        );
    });

    // Build row lines
    const rowLines = Array.from({ length: ROWS + 1 }, (_, i) => {
        const pct = `${(i / ROWS) * 100}%`;
        return (
            <GridLine key={`row-${i}`} x1="0%" y1={pct} x2="100%" y2={pct} opacity={opacity} />
        );
    });

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg width="100%" height="100%">
                {colLines}
                {rowLines}
            </Svg>
        </View>
    );
}
