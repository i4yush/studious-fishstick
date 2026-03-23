import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

interface XPProgressProps {
  xp: number;
  xpForLevel: number;
  level: number;
}

export function XPProgress({ xp, xpForLevel, level }: XPProgressProps) {
  const progress = Math.min((xp % xpForLevel) / xpForLevel, 1);
  const remaining = xpForLevel - (xp % xpForLevel);

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.xpLabel}>
          <Text style={styles.xpValue}>{(xp % xpForLevel).toLocaleString()}</Text>
          <Text style={styles.xpDivider}> / {xpForLevel.toLocaleString()} XP</Text>
        </Text>
        <Text style={styles.next}>{remaining.toLocaleString()} to LVL {level + 1}</Text>
      </View>
      <ProgressBar progress={progress} color={Colors.red} height={6} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  xpLabel: { flexDirection: 'row', alignItems: 'baseline' },
  xpValue: { color: Colors.white, fontFamily: Fonts.display, fontSize: 22, letterSpacing: 1 },
  xpDivider: { color: Colors.muted, fontFamily: Fonts.mono, fontSize: 11 },
  next: { color: Colors.muted, fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 1 },
});
