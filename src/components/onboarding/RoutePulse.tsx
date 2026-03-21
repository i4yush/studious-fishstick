import React, { useEffect } from 'react';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    withDelay,
    withRepeat,
    withSequence,
    Easing,
} from 'react-native-reanimated';
import Svg, { Polyline } from 'react-native-svg';
import { BRAND } from '@/utils/constants';
import { routeTraceTiming } from '@/animations/transitions';

const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);

// Hardcoded city-route coordinate path (normalised 0–280 space)
const ROUTE_POINTS = '20,260 20,200 60,200 60,140 100,140 100,80 160,80 160,130 220,130 220,60 260,60';
// Pre-measured stroke length for this path
const ROUTE_LENGTH = 560;

interface RoutePulseProps {
    width?: number;
    height?: number;
}

export default function RoutePulse({ width = 280, height = 280 }: RoutePulseProps) {
    const dashOffset = useSharedValue(ROUTE_LENGTH);

    useEffect(() => {
        // Draw-on then wait 2s, loop indefinitely
        dashOffset.value = withRepeat(
            withSequence(
                withTiming(0, routeTraceTiming),
                withDelay(2000, withTiming(ROUTE_LENGTH, { duration: 0 })),
            ),
            -1,
            false,
        );
    }, []);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: dashOffset.value,
    }));

    return (
        <Svg width={width} height={height} viewBox="0 0 280 280">
            {/* Static faint trail */}
            <Polyline
                points={ROUTE_POINTS}
                fill="none"
                stroke={BRAND.SPRINT_RED}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.12}
            />
            {/* Animated draw-on line */}
            <AnimatedPolyline
                points={ROUTE_POINTS}
                fill="none"
                stroke={BRAND.SPRINT_RED}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={ROUTE_LENGTH}
                animatedProps={animatedProps}
                opacity={0.85}
            />
        </Svg>
    );
}
