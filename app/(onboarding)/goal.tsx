import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { Button } from '@/components/ui/Button';

const GOALS = [
  { id: '10', label: '10 KM', desc: 'Casual runner', icon: '🌱' },
  { id: '20', label: '20 KM', desc: 'Dedicated runner', icon: '🔥' },
  { id: '40', label: '40 KM', desc: 'Territory dominator', icon: '⚡' },
  { id: '80', label: '80 KM+', desc: 'City hunter', icon: '👑' },
];

// Extracted component so hooks are called correctly per component, not inside .map()
function GoalCard({
  goal,
  isSelected,
  onPress,
}: {
  goal: typeof GOALS[0];
  isSelected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.93, { damping: 10, stiffness: 300 }, () => {
      scale.value = withSpring(1);
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable onPress={handlePress} style={styles.cardWrap}>
      <Animated.View style={[styles.card, isSelected && styles.cardSelected, aStyle]}>
        <Text style={styles.icon}>{goal.icon}</Text>
        <Text style={[styles.km, isSelected && { color: Colors.lime }]}>
          {goal.label}
        </Text>
        <Text style={styles.desc}>{goal.desc}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function GoalScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.step}>03 / 05</Text>
          <Text style={styles.title}>WEEKLY GOAL</Text>
          <Text style={styles.subtitle}>
            How many km do you want to conquer per week?
          </Text>
        </View>

        <View style={styles.grid}>
          {GOALS.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              isSelected={selected === goal.id}
              onPress={() => setSelected(goal.id)}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <Button
            label="Continue"
            onPress={() => router.push('/(onboarding)/identity')}
            fullWidth
            disabled={!selected}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.black },
  container: { flex: 1, paddingHorizontal: 24 },
  header: { paddingTop: 32, paddingBottom: 32, gap: 8 },
  step: { color: Colors.muted, fontFamily: Fonts.mono, fontSize: 11, letterSpacing: 2 },
  title: { color: Colors.white, fontFamily: Fonts.display, fontSize: 48, letterSpacing: 3 },
  subtitle: { color: Colors.muted, fontFamily: Fonts.bodyReg, fontSize: 14, lineHeight: 20 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    flex: 1,
  },
  cardWrap: { width: '47.5%' },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  cardSelected: { borderColor: Colors.lime },
  icon: { fontSize: 36 },
  km: {
    color: Colors.white,
    fontFamily: Fonts.display,
    fontSize: 28,
    letterSpacing: 2,
  },
  desc: { color: Colors.muted, fontFamily: Fonts.bodyReg, fontSize: 11, textAlign: 'center' },
  footer: { paddingBottom: 32, paddingTop: 12 },
});
