import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import Animated, {
  FadeInDown,
  ZoomIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';

// Mock data — in production this would come from the run store / nav params
const MOCK = {
  distance: 3.42,
  duration: 1247,
  pace: 6.07,
  xpEarned: 340,
  zonesCapt: ['Connaught Place', 'Barakhamba'],
};

function formatPace(p: number) {
  const min = Math.floor(p);
  const sec = Math.round((p - min) * 60);
  return `${min}:${String(sec).padStart(2, '0')}`;
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(m).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function PostRunSummary() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* XP burst */}
        <Animated.View entering={ZoomIn.delay(200).duration(600)} style={styles.xpBurst}>
          <Text style={styles.xpNum}>+{MOCK.xpEarned}</Text>
          <Text style={styles.xpLabel}>XP EARNED</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Text style={styles.title}>RUN COMPLETE</Text>
          <Text style={styles.subtitle}>
            {MOCK.zonesCapt.length} zone{MOCK.zonesCapt.length !== 1 ? 's' : ''} captured
          </Text>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.statsGrid}>
          <StatCard label="Distance" value={`${MOCK.distance.toFixed(2)} km`} barPercent={68} accentColor={Colors.lime} />
          <StatCard label="Duration" value={formatDuration(MOCK.duration)} barPercent={40} />
          <StatCard label="Avg Pace"  value={`${formatPace(MOCK.pace)}/km`} barPercent={55} accentColor={Colors.red} />
          <StatCard label="Zones"    value={`${MOCK.zonesCapt.length}`} barPercent={MOCK.zonesCapt.length * 20} accentColor={Colors.lime} highlight />
        </Animated.View>

        {/* Zones captured list */}
        {MOCK.zonesCapt.length > 0 && (
          <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.zonesSection}>
            <Text style={styles.sectionLabel}>ZONES CAPTURED</Text>
            {MOCK.zonesCapt.map((zone) => (
              <View key={zone} style={styles.zoneRow}>
                <View style={styles.zoneDot} />
                <Text style={styles.zoneName}>{zone}</Text>
                <Text style={styles.zoneXP}>+50 XP</Text>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Actions */}
        <Animated.View entering={FadeInDown.delay(700).duration(500)} style={styles.actions}>
          <Button label="Back to Home" onPress={() => router.replace('/(app)/dashboard')} fullWidth />
          <Button
            label="Share Run"
            variant="ghost"
            fullWidth
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.black },
  content: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 40, gap: 24, alignItems: 'center' },
  xpBurst: {
    backgroundColor: Colors.lime + '22',
    borderWidth: 2,
    borderColor: Colors.lime,
    borderRadius: 999,
    paddingHorizontal: 32,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 4,
  },
  xpNum: { color: Colors.lime, fontFamily: Fonts.display, fontSize: 56, letterSpacing: 2 },
  xpLabel: { color: Colors.lime, fontFamily: Fonts.mono, fontSize: 12, letterSpacing: 3 },
  title: {
    color: Colors.white,
    fontFamily: Fonts.display,
    fontSize: 40,
    letterSpacing: 3,
    textAlign: 'center',
  },
  subtitle: { color: Colors.muted, fontFamily: Fonts.bodyReg, fontSize: 14, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, width: '100%' },
  zonesSection: { width: '100%', gap: 10 },
  sectionLabel: { color: Colors.muted, fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 2 },
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lime + '44',
    padding: 14,
  },
  zoneDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.lime },
  zoneName: { flex: 1, color: Colors.white, fontFamily: Fonts.body, fontSize: 13, letterSpacing: 0.5 },
  zoneXP: { color: Colors.lime, fontFamily: Fonts.mono, fontSize: 11, letterSpacing: 1 },
  actions: { gap: 10, width: '100%' },
});
