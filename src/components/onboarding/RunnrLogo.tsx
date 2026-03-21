import React, { useEffect } from 'react';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Path, Rect, Polygon, Circle, G } from 'react-native-svg';
import type { SharedValue } from 'react-native-reanimated';
import { logoDrawTiming } from '@/animations/transitions';
import { BRAND } from '@/utils/constants';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Total path length for the "R" outline — pre-measured for the 100×120 viewBox
const STROKE_LENGTH = 340;

interface RunnrLogoProps {
    size?: number;
    animated?: boolean;
    progress?: SharedValue<number>;
}

export default function RunnrLogo({ size = 90, animated = false, progress }: RunnrLogoProps) {
    const internalProgress = useSharedValue(animated ? 0 : 1);
    const driveValue = progress ?? internalProgress;

    useEffect(() => {
        if (animated && !progress) {
            driveValue.value = withTiming(1, logoDrawTiming);
        }
    }, []);

    // Animated stroke-dash reveal
    const animatedPathProps = useAnimatedProps(() => ({
        strokeDashoffset: STROKE_LENGTH * (1 - driveValue.value),
        opacity: driveValue.value > 0.05 ? 1 : 0,
    }));

    const animatedCircleProps = useAnimatedProps(() => ({
        opacity: driveValue.value > 0.7 ? (driveValue.value - 0.7) / 0.3 : 0,
        r: 4 * driveValue.value,
    }));

    const w = size;
    const h = size * 1.2;

    return (
        <Svg width={w} height={h} viewBox="0 0 100 120">
            {/* Background square zone — the bump top of "R" */}
            <Rect
                x="8" y="10" width="54" height="48"
                fill="transparent"
                stroke={BRAND.SPRINT_RED}
                strokeWidth="1.5"
                opacity={0.15}
            />

            {/* Triangle zone — the diagonal leg of "R" */}
            <Polygon
                points="62,58 38,110 18,110"
                fill={BRAND.SPRINT_RED}
                opacity={0.12}
                stroke={BRAND.SPRINT_RED}
                strokeWidth="1"
            />

            {/* Main "R" letterform — animated stroke draw-on */}
            <AnimatedPath
                d={
                    // R shape: vertical stem + bump arm + diagonal leg
                    'M 18 100 L 18 18 L 52 18 Q 72 18 72 38 Q 72 56 52 56 L 18 56 M 44 56 L 72 100'
                }
                fill="none"
                stroke={BRAND.SPRINT_RED}
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={STROKE_LENGTH}
                animatedProps={animatedPathProps}
            />

            {/* Arrow end marker at diagonal terminus */}
            <AnimatedCircle
                cx="72" cy="100"
                fill={BRAND.SPRINT_RED}
                animatedProps={animatedCircleProps}
            />

            {/* RUNNR wordmark below — static */}
            <G opacity={animated ? undefined : 1}>
                <Path
                    d="M 10 115 L 90 115"
                    stroke={BRAND.SPRINT_RED}
                    strokeWidth="0.5"
                    opacity={0.3}
                />
            </G>
        </Svg>
    );
}
