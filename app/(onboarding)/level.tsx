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

const LEVELS = [
  {
    id: 'beginner',
    label: 'BEGINNER',
    desc: 'Just starting out. Under 5km/week.',
    icon: '🐢',
  },
  {
    id: 'intermediate',
    label: 'INTERMEDIATE',
    desc: 'Regular runner. 5–20km/week.',
    icon: '🏃',
  },
  {
    id: 'pro',
    label: 'PRO',
    desc: 'Serious athlete. 20km+/week.',
    icon: '⚡',
  },
];

function LevelOption({
  option,
  selected,
  onPress,
}: {
  option: typeof LEVELS[0];
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSpring(0.96, { damping: 10, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 300 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[styles.option, selected && styles.optionSelected, style]}
      >
        <Text style={styles.icon}>{option.icon}</Text>
        <View style={styles.optionText}>
          <Text style={[styles.optionLabel, selected && styles.optionLabelSel]}>
            {option.label}
          </Text>
          <Text style={styles.optionDesc}>{option.desc}</Text>
        </View>
        {selected && (
          <View style={styles.dot} />
        )}
      </Animated.View>
    </Pressable>
  );
}

export default function LevelScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.step}>02 / 05</Text>
          <Text style={styles.title}>YOUR LEVEL</Text>
          <Text style={styles.subtitle}>
            How experienced are you as a runner?
          </Text>
        </View>

        <View style={styles.options}>
          {LEVELS.map((lvl) => (
            <LevelOption
              key={lvl.id}
              option={lvl}
              selected={selected === lvl.id}
              onPress={() => setSelected(lvl.id)}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <Button
            label="Continue"
            onPress={() => router.push('/(onboarding)/goal')}
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
  options: { gap: 12, flex: 1 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    gap: 16,
  },
  optionSelected: { borderColor: Colors.red },
  icon: { fontSize: 32 },
  optionText: { flex: 1, gap: 2 },
  optionLabel: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
    letterSpacing: 1.5,
  },
  optionLabelSel: { color: Colors.white },
  optionDesc: { color: Colors.muted, fontFamily: Fonts.bodyReg, fontSize: 12 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.red,
  },
  footer: { paddingBottom: 32, paddingTop: 12 },
});
