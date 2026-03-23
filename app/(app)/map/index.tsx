import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
// // import MapView, { PROVIDER_GOOGLE, Polygon } from 'react-native-maps';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

// Dark map style for RUNNR
const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0A0A0A' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#555555' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0A0A0A' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1A1A1A' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#111111' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0A0F1A' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
];

// Mock zones for visual demo
const MOCK_OWN_ZONES = [
  [
    { latitude: 28.6139, longitude: 77.2090 },
    { latitude: 28.6139, longitude: 77.2120 },
    { latitude: 28.6115, longitude: 77.2120 },
    { latitude: 28.6115, longitude: 77.2090 },
  ],
  [
    { latitude: 28.6165, longitude: 77.2110 },
    { latitude: 28.6165, longitude: 77.2140 },
    { latitude: 28.6145, longitude: 77.2140 },
    { latitude: 28.6145, longitude: 77.2110 },
  ],
];

const MOCK_RIVAL_ZONES = [
  [
    { latitude: 28.6175, longitude: 77.2060 },
    { latitude: 28.6175, longitude: 77.2090 },
    { latitude: 28.6155, longitude: 77.2090 },
    { latitude: 28.6155, longitude: 77.2060 },
  ],
];

export default function TerritoryMapScreen() {
  const router = useRouter();
  // const mapRef = useRef<MapView>(null);
  const [stats] = useState({ owned: 38, rival: 12, total: 240 });

  return (
    <View style={styles.container}>
      <View style={[styles.map, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1A1A' }]}>
        <Text style={{ color: Colors.muted, fontFamily: Fonts.mono }}>[ MapView Placeholder ]</Text>
        <Text style={{ color: Colors.muted, fontFamily: Fonts.mono, fontSize: 10, marginTop: 8, textAlign: 'center', paddingHorizontal: 40 }}>
          react-native-maps requires a custom dev client to render properly.
        </Text>
      </View>

      {/* HUD overlay */}
      <View style={styles.hud} pointerEvents="box-none">
        {/* Top title */}
        <View style={styles.topBar}>
          <Text style={styles.title}>TERRITORY</Text>
          <View style={styles.legend}>
            <View style={[styles.dot, { backgroundColor: Colors.red }]} />
            <Text style={styles.legendText}>{stats.owned} YOURS</Text>
            <View style={[styles.dot, { backgroundColor: Colors.rival }]} />
            <Text style={styles.legendText}>{stats.rival} RIVAL</Text>
          </View>
        </View>

        {/* Bottom FAB */}
        <Pressable
          style={styles.fab}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/run');
          }}
        >
          <MaterialIcons name="play-arrow" size={28} color={Colors.black} />
          <Text style={styles.fabLabel}>START RUN</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  map: { flex: 1 },
  hud: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingBottom: 32,
  },
  topBar: {
    paddingTop: 64,
    paddingHorizontal: 20,
    gap: 8,
  },
  title: {
    color: Colors.white,
    fontFamily: Fonts.display,
    fontSize: 36,
    letterSpacing: 3,
    textShadowColor: Colors.black,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.black + 'CC',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: {
    color: Colors.white,
    fontFamily: Fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    marginRight: 4,
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.red,
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 16,
    alignSelf: 'center',
    shadowColor: Colors.red,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  fabLabel: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 20,
    letterSpacing: 2,
  },
});
