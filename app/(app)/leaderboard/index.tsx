import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { MaterialIcons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

const MOCK_LEADERBOARD = [
  { id: '1', name: 'v0id_walker', score: 12450, rank: 1, zones: 42, color: '#FF3B30' },
  { id: '2', name: 'cyber_runnr', score: 11200, rank: 2, zones: 38, color: '#4CD964' },
  { id: '3', name: 'neon_ghost', score: 10850, rank: 3, zones: 35, color: '#5856D6' },
  { id: '4', name: 'delta_prime', score: 9400, rank: 4, zones: 28, color: '#FF9500' },
  { id: '5', name: 'zero_cool', score: 8900, rank: 5, zones: 24, color: '#007AFF' },
  { id: '6', name: 'acid_burn', score: 8200, rank: 6, zones: 21, color: '#FF2D55' },
];

export default function LeaderboardScreen() {
  const [filter, setFilter] = useState<'city' | 'global'>('city');

  const renderItem = ({ item }: { item: typeof MOCK_LEADERBOARD[0] }) => (
    <View style={styles.row}>
      <View style={styles.rankContainer}>
        <Text style={[styles.rank, item.rank <= 3 && styles.topRank]}>
          {item.rank.toString().padStart(2, '0')}
        </Text>
      </View>
      
      <Avatar name={item.name} size={40} color={item.color} />
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userStats}>{item.zones} ZONES CAPTURED</Text>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.score}>{item.score.toLocaleString()}</Text>
        <Text style={styles.scoreLabel}>PTS</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>RANKINGS</Text>
        <View style={styles.filterBar}>
          <Pressable 
            style={[styles.filterTab, filter === 'city' && styles.activeTab]}
            onPress={() => setFilter('city')}
          >
            <Text style={[styles.filterText, filter === 'city' && styles.activeFilterText]}>NEO DELHI</Text>
          </Pressable>
          <Pressable 
            style={[styles.filterTab, filter === 'global' && styles.activeTab]}
            onPress={() => setFilter('global')}
          >
            <Text style={[styles.filterText, filter === 'global' && styles.activeFilterText]}>GLOBAL</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={MOCK_LEADERBOARD}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 32,
    color: Colors.white,
    letterSpacing: 4,
    marginBottom: 20,
  },
  filterBar: {
    flexDirection: 'row',
    backgroundColor: Colors.muted + '22',
    borderRadius: 8,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: Colors.red,
  },
  filterText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.muted,
    letterSpacing: 1,
  },
  activeFilterText: {
    color: Colors.black,
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.muted + '22',
  },
  rankContainer: {
    width: 32,
  },
  rank: {
    fontFamily: Fonts.mono,
    fontSize: 14,
    color: Colors.muted,
  },
  topRank: {
    color: Colors.red,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontFamily: Fonts.display,
    fontSize: 14,
    color: Colors.white,
    letterSpacing: 1,
  },
  userStats: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    color: Colors.muted,
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  score: {
    fontFamily: Fonts.mono,
    fontSize: 16,
    color: Colors.white,
    fontWeight: '700',
  },
  scoreLabel: {
    fontFamily: Fonts.mono,
    fontSize: 8,
    color: Colors.red,
    marginTop: 2,
  },
});
