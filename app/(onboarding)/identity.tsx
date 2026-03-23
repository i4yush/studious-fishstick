import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { Button } from '@/components/ui/Button';

const AVATAR_COLORS = [
  Colors.red,    // Sprint Red
  Colors.lime,   // Runnr Lime
  '#4ECDC4',    // Teal
  '#FFE66D',    // Yellow
  '#A78BFA',    // Purple
  '#F97316',    // Orange
  '#06B6D4',    // Cyan
  '#EC4899',    // Pink
];

export default function IdentityScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [avatarColor, setAvatarColor] = useState<string>(Colors.red);

  const initials = username.slice(0, 2).toUpperCase() || '??';

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.step}>04 / 05</Text>
            <Text style={styles.title}>IDENTITY</Text>
            <Text style={styles.subtitle}>
              What do other runners call you?
            </Text>
          </View>

          {/* Avatar preview */}
          <View style={styles.avatarSection}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: avatarColor },
              ]}
            >
              <Text style={styles.avatarText}>{initials}</Text>
            </View>

            {/* Color swatches */}
            <View style={styles.swatches}>
              {AVATAR_COLORS.map((clr) => (
                <Pressable
                  key={clr}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setAvatarColor(clr);
                  }}
                  style={[
                    styles.swatch,
                    { backgroundColor: clr },
                    avatarColor === clr && styles.swatchSelected,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Username input */}
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>USERNAME</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="e.g. streetwolf"
              placeholderTextColor={Colors.muted}
              style={styles.input}
              autoCapitalize="none"
              maxLength={20}
            />
            <Text style={styles.inputHint}>{username.length}/20</Text>
          </View>

          <View style={styles.footer}>
            <Button
              label="Continue"
              onPress={() => router.push('/(onboarding)/permissions')}
              fullWidth
              disabled={username.trim().length < 2}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.black },
  flex: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24 },
  header: { paddingTop: 32, paddingBottom: 24, gap: 8 },
  step: { color: Colors.muted, fontFamily: Fonts.mono, fontSize: 11, letterSpacing: 2 },
  title: { color: Colors.white, fontFamily: Fonts.display, fontSize: 48, letterSpacing: 3 },
  subtitle: { color: Colors.muted, fontFamily: Fonts.bodyReg, fontSize: 14, lineHeight: 20 },
  avatarSection: { alignItems: 'center', gap: 20, marginBottom: 32 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 36,
    letterSpacing: 2,
  },
  swatches: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: Colors.white,
  },
  inputWrap: { gap: 8, marginBottom: 'auto' },
  inputLabel: {
    color: Colors.muted,
    fontFamily: Fonts.mono,
    fontSize: 10,
    letterSpacing: 2,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.white,
    fontFamily: Fonts.body,
    fontSize: 16,
    padding: 16,
    letterSpacing: 1,
  },
  inputHint: {
    color: Colors.muted,
    fontFamily: Fonts.mono,
    fontSize: 11,
    textAlign: 'right',
  },
  footer: { paddingBottom: 32, paddingTop: 12 },
});
