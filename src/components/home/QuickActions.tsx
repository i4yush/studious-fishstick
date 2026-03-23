import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

const ACTIONS = [
  { icon: 'map' as IconName,         label: 'Territory',   route: '/(app)/map',          color: Colors.red },
  { icon: 'leaderboard' as IconName, label: 'Rankings',    route: '/(app)/leaderboard',  color: Colors.lime },
  { icon: 'groups' as IconName,      label: 'My Squad',    route: '/(app)/squads',       color: '#4ECDC4' },
  { icon: 'emoji-events' as IconName,label: 'Rewards',     route: '/(app)/rewards',      color: '#FFE66D' },
];

export function QuickActions() {
  const router = useRouter();

  return (
    <View style={styles.grid}>
      {ACTIONS.map((action) => (
        <Pressable
          key={action.label}
          style={styles.card}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(action.route as any);
          }}
        >
          <View style={[styles.iconWrap, { backgroundColor: action.color + '22' }]}>
            <MaterialIcons name={action.icon} size={22} color={action.color} />
          </View>
          <Text style={styles.label}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 10,
    width: '47.5%',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: Colors.white,
    fontFamily: Fonts.body,
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
