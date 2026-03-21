import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { BRAND, FONT_DISPLAY, FONT_BODY, FONT_MONO } from '@/utils/constants';
import { springGentle } from '@/animations/transitions';
import CityGridBackground from '@/components/onboarding/CityGridBackground';
import RoutePulse from '@/components/onboarding/RoutePulse';
import StatsTicker from '@/components/onboarding/StatsTicker';
import CTAButton from '@/components/onboarding/CTAButton';

const { width: SCREEN_W } = Dimensions.get('window');

export default function CTAScreen() {
    const router = useRouter();

    // Entry animation — slide-up + fade-in
    const translateY = useSharedValue(60);
    const opacity = useSharedValue(0);

    const contentStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    useEffect(() => {
        translateY.value = withSpring(0, springGentle);
        opacity.value = withTiming(1, { duration: 500 });
    }, []);

    const handleCTA = () => {
        router.push('/(auth)/register');
    };

    return (
        <View style={styles.container}>
            {/* Background grid - subtle */}
            <CityGridBackground />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={[styles.content, contentStyle]}>
                    {/* Territory Preview Map */}
                    <View style={styles.mapContainer}>
                        <RoutePulse width={SCREEN_W - 48} height={260} />
                        <View style={styles.mapOverlay}>
                            <Text style={styles.mapLabel}>LIVE TERRITORY MAP</Text>
                        </View>
                    </View>

                    {/* Eyebrow label */}
                    <Text style={styles.eyebrow}>YOUR CITY IS BEING TAKEN</Text>

                    {/* Hero headline */}
                    <Text style={styles.headline}>{"CLAIM YOUR\nTERRITORY"}</Text>

                    {/* FOMO stats */}
                    <StatsTicker />

                    {/* CTA Divider */}
                    <View style={styles.divider} />

                    {/* Primary CTA */}
                    <CTAButton onPress={handleCTA} />

                    {/* Sign-in link */}
                    <View style={styles.signinRow}>
                        <Text style={styles.signinText}>Already running? </Text>
                        <Link href="/(auth)/login" style={styles.signinLink}>
                            Sign in
                        </Link>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BRAND.VOID_BLACK,
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 48,
    },
    content: {
        gap: 16,
    },
    // Map
    mapContainer: {
        borderWidth: 1,
        borderColor: BRAND.MUTED,
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 8,
        backgroundColor: BRAND.SURFACE,
    },
    mapOverlay: {
        position: 'absolute',
        top: 10,
        left: 12,
    },
    mapLabel: {
        color: BRAND.SPRINT_RED,
        fontFamily: FONT_MONO,
        fontSize: 10,
        letterSpacing: 2,
        opacity: 0.7,
    },
    // Text hierarchy
    eyebrow: {
        color: BRAND.SPRINT_RED,
        fontFamily: FONT_DISPLAY,
        fontSize: 13,
        letterSpacing: 3,
        marginTop: 4,
    },
    headline: {
        color: '#FFFFFF',
        fontFamily: FONT_DISPLAY,
        fontSize: 56,
        lineHeight: 60,
        letterSpacing: 1,
    },
    // Divider
    divider: {
        height: 1,
        backgroundColor: BRAND.MUTED,
        marginVertical: 4,
    },
    // Sign in
    signinRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
    },
    signinText: {
        color: BRAND.MUTED,
        fontFamily: FONT_BODY,
        fontSize: 14,
    },
    signinLink: {
        color: BRAND.MUTED,
        fontFamily: FONT_BODY,
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
