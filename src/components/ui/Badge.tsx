import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

interface BadgeProps {
  label: string;
  color?: string;
  textColor?: string;
}

export function Badge({
  label,
  color = Colors.surface,
  textColor = Colors.muted,
}: BadgeProps) {
  return (
    <View style={[styles.pill, { backgroundColor: color }]}>
      <Text style={[styles.text, { color: textColor }]}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontFamily: Fonts.mono,
  },
});
