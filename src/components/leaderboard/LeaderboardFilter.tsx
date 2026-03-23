import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

interface LeaderboardFilterProps {
  filters: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function LeaderboardFilter({
  filters,
  activeIndex,
  onSelect,
}: LeaderboardFilterProps) {
  return (
    <View style={styles.container}>
      {filters.map((filter, i) => {
        const isActive = i === activeIndex;

        return (
          <Pressable
            key={filter}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(i);
            }}
            style={[styles.pill, isActive && styles.pillActive]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {filter}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.card,
  },
  pillActive: {
    borderColor: Colors.red,
    backgroundColor: Colors.red,
  },
  label: {
    color: Colors.muted,
    fontFamily: Fonts.mono,
    fontSize: 10,
    letterSpacing: 1.5,
  },
  labelActive: {
    color: Colors.black,
  },
});
