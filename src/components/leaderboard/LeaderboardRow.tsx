import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { MaterialIcons } from '@expo/vector-icons';

interface LeaderboardRowProps {
  rank: number;
  username: string;
  xp: number;
  zones: number;
  isMe?: boolean;
  index: number;
}

const RANK_COLORS: Record<number, string> = {
  1: '#FFE66D',
  2: '#C0C0C0',
  3: '#CD7F32',
};

export function LeaderboardRow({ rank, username, xp, zones, isMe, index }: LeaderboardRowProps) {
  const rankColor = RANK_COLORS[rank] ?? Colors.muted;

  return (
    <View style={[styles.row, isMe && styles.rowMe]}>
      <Text style={[styles.rank, { color: rankColor }]}>#{rank}</Text>
      <Avatar
        name={username}
        size={36}
        color={isMe ? Colors.red : Colors.surface}
      />
      <View style={styles.info}>
        <Text style={[styles.username, isMe && styles.usernameMe]}>
          {username}
          {isMe && ' (you)'}
        </Text>
        <Text style={styles.meta}>{zones} zones</Text>
      </View>
      <View style={styles.xpWrap}>
        <Text style={[styles.xp, isMe && { color: Colors.red }]}>
          {(xp / 1000).toFixed(1)}K
        </Text>
        <Text style={styles.xpLabel}>XP</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  rowMe: {
    borderColor: Colors.red,
    backgroundColor: Colors.red + '11',
  },
  rank: {
    fontFamily: Fonts.display,
    fontSize: 18,
    letterSpacing: 1,
    width: 36,
    textAlign: 'center',
  },
  info: { flex: 1, gap: 2 },
  username: {
    color: Colors.white,
    fontFamily: Fonts.body,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  usernameMe: { color: Colors.white },
  meta: { color: Colors.muted, fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 1 },
  xpWrap: { alignItems: 'flex-end' },
  xp: {
    color: Colors.white,
    fontFamily: Fonts.display,
    fontSize: 20,
    letterSpacing: 1,
  },
  xpLabel: { color: Colors.muted, fontFamily: Fonts.mono, fontSize: 9 },
});
