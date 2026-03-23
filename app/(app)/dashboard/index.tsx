import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { MaterialIcons } from '@expo/vector-icons';
import { RunnrLogo } from '@/components/brand/RunnrLogo';
import { StatCard } from '@/components/ui/StatCard';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <RunnrLogo width={120} height={40} />
        <Pressable style={styles.profileButton}>
          <MaterialIcons name="person-outline" size={24} color={Colors.white} />
        </Pressable>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={styles.greeting}>GLHF, RUNNR</Text>
        <Text style={styles.subGreeting}>NEO DELHI IS 12% CAPTURED</Text>
      </View>

      <View style={styles.statsRow}>
        <StatCard
          label="LVL"
          value="14"
          subValue="STREAK: 5"
          color={Colors.red}
        />
        <StatCard
          label="RUNS"
          value="12"
          subValue="THIS WEEK"
          color={Colors.red}
        />
      </View>

      <View style={styles.xpSection}>
        <View style={styles.xpHeader}>
          <Text style={styles.xpLabel}>XP PROGRESS</Text>
          <Text style={styles.xpValue}>2,450 / 3,000</Text>
        </View>
        <ProgressBar progress={0.8} color={Colors.red} />
      </View>

      <View style={styles.quickActions}>
        <Pressable style={styles.actionCard}>
          <MaterialIcons name="map" size={32} color={Colors.red} />
          <Text style={styles.actionLabel}>EXPLORE</Text>
        </Pressable>
        <Pressable style={[styles.actionCard, styles.primaryAction]}>
          <MaterialIcons name="play-arrow" size={40} color={Colors.black} />
          <Text style={[styles.actionLabel, { color: Colors.black }]}>START RUN</Text>
        </Pressable>
        <Pressable style={styles.actionCard}>
          <MaterialIcons name="groups" size={32} color={Colors.red} />
          <Text style={styles.actionLabel}>SQUAD</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.muted + '22',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    marginBottom: 32,
  },
  greeting: {
    fontFamily: Fonts.display,
    fontSize: 42,
    color: Colors.white,
    letterSpacing: 2,
  },
  subGreeting: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    color: Colors.red,
    letterSpacing: 1,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  xpSection: {
    marginBottom: 40,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  xpLabel: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.muted,
    letterSpacing: 1,
  },
  xpValue: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    color: Colors.white,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: Colors.muted + '11',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.muted + '22',
  },
  primaryAction: {
    backgroundColor: Colors.red,
    borderColor: Colors.red,
    transform: [{ scale: 1.1 }],
  },
  actionLabel: {
    fontFamily: Fonts.display,
    fontSize: 10,
    color: Colors.white,
    letterSpacing: 1,
  },
});
