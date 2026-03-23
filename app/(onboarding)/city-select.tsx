import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
} from 'react-native';
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

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore',
  'Chennai', 'Hyderabad', 'Pune',
  'Kolkata', 'Ahmedabad', 'Jaipur',
  'Surat',
];

function CityCard({
  city,
  selected,
  onPress,
}: {
  city: string;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSpring(0.93, { damping: 10, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 300 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          styles.cityCard,
          selected && styles.cityCardSelected,
          style,
        ]}
      >
        <Text style={[styles.cityText, selected && styles.cityTextSelected]}>
          {city}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export default function CitySelectScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.step}>01 / 05</Text>
          <Text style={styles.title}>YOUR CITY</Text>
          <Text style={styles.subtitle}>
            Where do you run? We'll track your territory here.
          </Text>
        </View>

        {/* City grid */}
        <ScrollView
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        >
          {CITIES.map((city) => (
            <CityCard
              key={city}
              city={city}
              selected={selected === city}
              onPress={() => setSelected(city)}
            />
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label="Continue"
            onPress={() => router.push('/(onboarding)/level')}
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
  header: { paddingTop: 32, paddingBottom: 24, gap: 8 },
  step: {
    color: Colors.muted,
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 2,
  },
  title: {
    color: Colors.white,
    fontFamily: Fonts.display,
    fontSize: 48,
    letterSpacing: 3,
  },
  subtitle: {
    color: Colors.muted,
    fontFamily: Fonts.bodyReg,
    fontSize: 14,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingBottom: 24,
  },
  cityCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  cityCardSelected: {
    borderColor: Colors.red,
    backgroundColor: Colors.red + '22',
  },
  cityText: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
    letterSpacing: 1,
  },
  cityTextSelected: {
    color: Colors.red,
  },
  footer: { paddingBottom: 32, paddingTop: 12 },
});
