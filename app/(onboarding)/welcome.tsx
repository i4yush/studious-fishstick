import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withRepeat,
    withSequence,
    Easing,
} from 'react-native-reanimated';
import { BRAND, FONT_DISPLAY, FONT_MONO } from '@/utils/constants';
import { logoDrawTiming } from '@/animations/transitions';
import CityGridBackground from '@/components/onboarding/CityGridBackground';
import RoutePulse from '@/components/onboarding/RoutePulse';
import RunnrLogo from '@/components/onboarding/RunnrLogo';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const AUTO_ADVANCE_MS = 2800;

export default function WelcomeScreen() {
    const router = useRouter();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Logo draw progress shared value
    const logoProgress = useSharedValue(0);

    // Tagline fade
    const taglineOpacity = useSharedValue(0);

    // "TAP TO ENTER" blink
    const tapOpacity = useSharedValue(0);

    const taglineStyle = useAnimatedStyle(() => ({
        opacity: taglineOpacity.value,
    }));

    const tapStyle = useAnimatedStyle(() => ({
        opacity: tapOpacity.value,
    }));

    useEffect(() => {
        // Logo draw-on starts immediately
        logoProgress.value = withTiming(1, logoDrawTiming);

        // Tagline fades in at 1400ms
        taglineOpacity.value = withDelay(
            1400,
            withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) }),
        );

        // "TAP TO ENTER" appears at 2200ms and blinks
        tapOpacity.value = withDelay(
            2200,
            withRepeat(
                withSequence(
                    withTiming(1, { duration: 400 }),
                    withTiming(0, { duration: 400 }),
                ),
                -1,
                false,
            ),
        );

        // Auto-advance after 2800ms
        timerRef.current = setTimeout(() => {
            router.replace('/(onboarding)/');
        }, AUTO_ADVANCE_MS);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const handleTap = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        router.replace('/(onboarding)/');
    };

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={1}
            onPress={handleTap}
        >
            {/* Layer 1: Pulsing city grid */}
            <CityGridBackground />

            {/* Layer 2: Route trace overlay in lower portion */}
            <View style={styles.routeContainer} pointerEvents="none">
                <RoutePulse width={SCREEN_W} height={SCREEN_H * 0.55} />
            </View>

            {/* Layer 3: Center content */}
            <View style={styles.center}>
                {/* Logo draws on over 1.2s */}
                <RunnrLogo size={110} animated progress={logoProgress} />

                {/* App name */}
                <Text style={styles.appName}>RUNNR</Text>

                {/* Tagline fades in at 1.4s */}
                <Animated.Text style={[styles.tagline, taglineStyle]}>
                    {"CAPTURE THE CITY.\nRUN IT. OWN IT."}
                </Animated.Text>
            </View>

            {/* Layer 4: Tap hint blinks at 2.2s */}
            <Animated.Text style={[styles.tapHint, tapStyle]}>
                TAP TO ENTER
            </Animated.Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BRAND.VOID_BLACK,
        alignItems: 'center',
        justifyContent: 'center',
    },
    routeContainer: {
        ...StyleSheet.absoluteFillObject,
        top: SCREEN_H * 0.4,
        opacity: 0.6,
    },
    center: {
        alignItems: 'center',
        gap: 8,
        zIndex: 1,
    },
    appName: {
        color: '#FFFFFF',
        fontFamily: FONT_DISPLAY,
        fontSize: 52,
        letterSpacing: 12,
        marginTop: -4,
    },
    tagline: {
        color: '#FFFFFF',
        fontFamily: FONT_DISPLAY,
        fontSize: 38,
        textAlign: 'center',
        lineHeight: 46,
        letterSpacing: 1.5,
        marginTop: 16,
    },
    tapHint: {
        position: 'absolute',
        bottom: 60,
        color: BRAND.MUTED,
        fontFamily: FONT_MONO,
        fontSize: 11,
        letterSpacing: 3,
    },
});
