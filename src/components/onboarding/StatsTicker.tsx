import React, { useEffect } from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import {
    useSharedValue,
    useDerivedValue,
    withTiming,
    withDelay,
} from 'react-native-reanimated';
import { BRAND, FONT_MONO } from '@/utils/constants';
import { statsCountTiming } from '@/animations/transitions';

interface StatRow {
    target: number;
    label: string;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}

const STATS: StatRow[] = [
    { target: 12847, label: 'runners active', prefix: '', suffix: '' },
    { target: 3.2, label: 'blocks captured today', prefix: '', suffix: 'M', decimals: 1 },
    { target: 0, label: 'YOUR CITY IS BEING TAKEN →', prefix: '', suffix: '' },
];

function StatCounter({ stat, delayMs }: { stat: StatRow; delayMs: number }) {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withDelay(delayMs, withTiming(1, statsCountTiming));
    }, []);

    // We use a JS-driven counter via useState + Animated callback
    const [displayValue, setDisplayValue] = React.useState('0');

    // Drive the counter using worklet + runOnJS
    const derived = useDerivedValue(() => progress.value);

    useEffect(() => {
        // Poll the animated value and update display
        const interval = setInterval(() => {
            // We use a simple interpolation outside the worklet
            const current = derived.value;
            if (stat.target === 0) {
                setDisplayValue('');
                return;
            }
            const val = stat.target * current;
            if (stat.decimals) {
                setDisplayValue(val.toFixed(stat.decimals));
            } else {
                setDisplayValue(Math.floor(val).toLocaleString());
            }
            if (current >= 1) {
                clearInterval(interval);
            }
        }, 32);
        return () => clearInterval(interval);
    }, []);

    const isSpecial = stat.target === 0;

    return (
        <View style={styles.row}>
            <RNText style={[styles.number, isSpecial && styles.specialText]}>
                {isSpecial
                    ? stat.label
                    : `${stat.prefix}${displayValue}${stat.suffix} ${stat.label}`}
            </RNText>
        </View>
    );
}

export default function StatsTicker() {
    return (
        <View style={styles.container}>
            {STATS.map((stat, i) => (
                <StatCounter key={i} stat={stat} delayMs={i * 200} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 6,
        paddingVertical: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    number: {
        color: BRAND.RUNNR_LIME,
        fontFamily: FONT_MONO,
        fontSize: 12,
        letterSpacing: 0.5,
    },
    specialText: {
        color: BRAND.SPRINT_RED,
        fontFamily: FONT_MONO,
        fontSize: 11,
        letterSpacing: 1.5,
    },
});
