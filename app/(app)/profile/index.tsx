import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { MaterialIcons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>IDENTITY</Text>
          <Pressable style={styles.settingsButton}>
            <MaterialIcons name="settings" size={24} color={Colors.white} />
          </Pressable>
        </View>

        <View style={styles.profileInfo}>
          <Avatar name="v0id_walker" size={100} color={Colors.red} />
          <View style={styles.nameSection}>
            <Text style={styles.userName}>v0id_walker</Text>
            <View style={styles.rankBadge}>
              <MaterialIcons name="verified" size={14} color={Colors.red} />
              <Text style={styles.rankText}>VETERAN RUNNR</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <StatCard label="TOTAL KM" value="142.5" color={Colors.red} />
          <StatCard label="ZONES" value="42" color={Colors.red} />
        </View>
        <View style={styles.statsRow}>
          <StatCard label="AVG PACE" value="5'12\" color={Colors.red} />
          <StatCard label="STREAK" value="5" subValue="DAYS" color={Colors.red} />
        </View>
      </View>

      <View style={styles.achievements}>
        <Text style={styles.sectionTitle}>COLLECTIBLES</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeScroll}>
          <Badge label="FIRST BLOOD" color={Colors.red} />
          <Badge label="NIGHT OWL" color={Colors.rival} />
          <Badge label="TRAILBLAZER" color={Colors.white} />
          <Badge label="STREAK KING" color={Colors.lime} />
        </ScrollView>
      </View>

      <Pressable style={styles.logoutButton}>
        <MaterialIcons name="logout" size={20} color={Colors.muted} />
        <Text style={styles.logoutText}>TERMINATE SESSION</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  content: {
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 32,
    color: Colors.white,
    letterSpacing: 4,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.muted + '22',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  nameSection: {
    flex: 1,
  },
  userName: {
    fontFamily: Fonts.display,
    fontSize: 28,
    color: Colors.white,
    letterSpacing: 1,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  rankText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.red,
    letterSpacing: 1,
  },
  statsSection: {
    gap: 16,
    marginBottom: 40,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  achievements: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    color: Colors.muted,
    letterSpacing: 2,
    marginBottom: 16,
  },
  badgeScroll: {
    gap: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.muted + '22',
    borderRadius: 12,
  },
  logoutText: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    color: Colors.muted,
    letterSpacing: 1,
  },
});
