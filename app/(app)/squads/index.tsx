import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const MOCK_SQUADS = [
  {
    id: '1',
    name: 'Night Runners',
    city: 'Delhi',
    members: 12,
    territory: 184,
    color: Colors.red,
  },
  {
    id: '2',
    name: 'Urban Foxes',
    city: 'Mumbai',
    members: 8,
    territory: 97,
    color: Colors.lime,
  },
  {
    id: '3',
    name: 'Grid Wolves',
    city: 'Bangalore',
    members: 15,
    territory: 203,
    color: '#A78BFA',
  },
];

export default function SquadsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.title}>SQUADS</Text>
          <Text style={styles.subtitle}>Run together · Dominate together</Text>
        </Animated.View>

        {/* Create squad CTA */}
        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <Button
            label="+ Create a Squad"
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            fullWidth
          />
        </Animated.View>

        <Text style={styles.sectionLabel}>TOP SQUADS IN YOUR CITY</Text>

        {MOCK_SQUADS.map((squad, i) => (
          <Animated.View
            key={squad.id}
            entering={FadeInDown.delay(160 + i * 80).duration(500)}
          >
            <Pressable
              style={[styles.card, { borderColor: squad.color + '66' }]}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              {/* Color stripe */}
              <View style={[styles.stripe, { backgroundColor: squad.color }]} />

              <View style={styles.cardContent}>
                <View style={styles.cardTop}>
                  <View style={styles.cardLeft}>
                    <Text style={[styles.squadName, { color: squad.color }]}>
                      {squad.name.toUpperCase()}
                    </Text>
                    <View style={styles.metaRow}>
                      <MaterialIcons name="location-on" size={12} color={Colors.muted} />
                      <Text style={styles.city}>{squad.city}</Text>
                    </View>
                  </View>
                  <View style={styles.territory}>
                    <Text style={[styles.territoryNum, { color: squad.color }]}>
                      {squad.territory}
                    </Text>
                    <Text style={styles.territoryLabel}>ZONES</Text>
                  </View>
                </View>

                <View style={styles.cardBottom}>
                  <View style={styles.members}>
                    {[...Array(Math.min(squad.members, 5))].map((_, i2) => (
                      <View
                        key={i2}
                        style={[
                          styles.memberDot,
                          { backgroundColor: squad.color, marginLeft: i2 > 0 ? -8 : 0 },
                        ]}
                      />
                    ))}
                    <Text style={styles.memberCount}>
                      {squad.members} members
                    </Text>
                  </View>
                  <Pressable style={[styles.joinBtn, { borderColor: squad.color }]}>
                    <Text style={[styles.joinLabel, { color: squad.color }]}>JOIN</Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.black },
  content: { paddingHorizontal: 20, paddingTop: 48, paddingBottom: 40, gap: 16 },
  header: { gap: 4, marginBottom: 4 },
  title: { color: Colors.white, fontFamily: Fonts.display, fontSize: 48, letterSpacing: 3 },
  subtitle: { color: Colors.muted, fontFamily: Fonts.bodyReg, fontSize: 13 },
  sectionLabel: {
    color: Colors.muted,
    fontFamily: Fonts.mono,
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 8,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  stripe: { width: 4 },
  cardContent: { flex: 1, padding: 16, gap: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLeft: { gap: 4 },
  squadName: { fontFamily: Fonts.display, fontSize: 22, letterSpacing: 1.5 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  city: { color: Colors.muted, fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 1 },
  territory: { alignItems: 'flex-end' },
  territoryNum: { fontFamily: Fonts.display, fontSize: 32, letterSpacing: 1 },
  territoryLabel: { color: Colors.muted, fontFamily: Fonts.mono, fontSize: 9, letterSpacing: 2 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  members: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  memberDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.card },
  memberCount: { color: Colors.muted, fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 1 },
  joinBtn: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  joinLabel: { fontFamily: Fonts.body, fontSize: 11, letterSpacing: 1.5 },
});
