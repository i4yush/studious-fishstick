import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
// import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useRun } from '@/hooks/useRun';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0A0A0A' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#555555' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1A1A1A' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0A0F1A' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
];

function PulseDot() {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.5, { duration: 800 }), withTiming(1, { duration: 800 })),
      -1, false,
    );
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[styles.pulseDot, style]} />
  );
}

function formatDuration(s: number): string {
  const m = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(m).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatPace(paceMinKm: number): string {
  if (!paceMinKm || !isFinite(paceMinKm)) return '--:--';
  const min = Math.floor(paceMinKm);
  const sec = Math.round((paceMinKm - min) * 60);
  return `${min}:${String(sec).padStart(2, '0')}`;
}

export default function ActiveRunScreen() {
  const router = useRouter();
  // const mapRef = useRef<MapView>(null);
  const { state, coords, route, distance, pace, duration, startRun, pauseRun, resumeRun, stopRun } = useRun();
  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await startRun();
    setStarted(true);
  };

  const handleStop = () => {
    Alert.alert('End Run?', 'Are you sure you want to stop this run?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'End Run',
        style: 'destructive',
        onPress: () => {
          stopRun();
          router.push('/run/summary');
        },
      },
    ]);
  };

  // Center map on user as they move
  // useEffect(() => {
  //   if (coords && mapRef.current) {
  //     mapRef.current.animateToRegion({
  //       latitude: coords.latitude,
  //       longitude: coords.longitude,
  //       latitudeDelta: 0.005,
  //       longitudeDelta: 0.005,
  //     }, 500);
  //   }
  // }, [coords]);

  return (
    <View style={styles.container}>
      {/* Map — top 45% */}
      <View style={[styles.map, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1A1A' }]}>
        <Text style={{ color: Colors.muted, fontFamily: Fonts.mono }}>[ MapView Placeholder ]</Text>
      </View>

      {/* Live GPS pill */}
      <View style={styles.gpsPill}>
        <PulseDot />
        <Text style={styles.gpsText}>LIVE · GPS</Text>
      </View>

      {/* Bottom stats panel */}
      <View style={styles.panel}>
        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatPace(pace)}</Text>
            <Text style={styles.statLabel}>PACE / KM</Text>
          </View>
          <View style={[styles.statItem, styles.statCenter]}>
            <Text style={[styles.statValue, styles.statBig]}>
              {distance.toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>KM</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatDuration(duration)}</Text>
            <Text style={styles.statLabel}>ELAPSED</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {!started ? (
            <Pressable style={styles.startBtn} onPress={handleStart}>
              <MaterialIcons name="play-arrow" size={36} color={Colors.black} />
              <Text style={styles.startBtnLabel}>START RUN</Text>
            </Pressable>
          ) : (
            <View style={styles.runControls}>
              <Pressable
                style={styles.secondaryBtn}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  state === 'paused' ? resumeRun() : pauseRun();
                }}
              >
                <MaterialIcons
                  name={state === 'paused' ? 'play-arrow' : 'pause'}
                  size={28}
                  color={Colors.white}
                />
              </Pressable>
              <Pressable style={styles.stopBtn} onPress={handleStop}>
                <MaterialIcons name="stop" size={32} color={Colors.black} />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  map: { flex: 0.45 },
  gpsPill: {
    position: 'absolute',
    top: 56,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.card + 'EE',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.lime,
  },
  gpsText: { color: Colors.lime, fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 1.5 },
  panel: {
    flex: 0.55,
    padding: 24,
    gap: 24,
    justifyContent: 'space-between',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  statItem: { alignItems: 'center', gap: 4 },
  statCenter: { alignItems: 'center' },
  statValue: {
    color: Colors.white,
    fontFamily: Fonts.display,
    fontSize: 28,
    letterSpacing: 1,
  },
  statBig: { fontSize: 52, color: Colors.lime },
  statLabel: { color: Colors.muted, fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 2 },
  controls: { alignItems: 'center' },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.red,
    borderRadius: 999,
    paddingHorizontal: 40,
    paddingVertical: 18,
    shadowColor: Colors.red,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  startBtnLabel: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 24,
    letterSpacing: 2,
  },
  runControls: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  secondaryBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.red,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
});
