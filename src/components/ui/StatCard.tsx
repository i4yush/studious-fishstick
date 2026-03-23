import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

interface StatCardProps {
  label: string;
  value: string;
  barPercent?: number;  // 0–100
  highlight?: boolean;
  accentColor?: string;
}

export function StatCard({
  label,
  value,
  barPercent = 0,
  highlight = false,
  accentColor = Colors.red,
}: StatCardProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(barPercent, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [barPercent]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={[styles.card, highlight && styles.highlighted]}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <Text style={[styles.value, highlight && { color: accentColor }]}>
        {value}
      </Text>
      {barPercent > 0 && (
        <View style={styles.barTrack}>
          <Animated.View
            style={[styles.barFill, barStyle, { backgroundColor: accentColor }]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 6,
  },
  highlighted: {
    borderColor: Colors.red,
  },
  label: {
    color: Colors.muted,
    fontSize: 10,
    letterSpacing: 1.5,
    fontFamily: Fonts.mono,
  },
  value: {
    color: Colors.white,
    fontSize: 24,
    fontFamily: Fonts.display,
    letterSpacing: 1,
  },
  barTrack: {
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
});
