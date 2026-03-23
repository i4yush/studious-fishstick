import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/useAuthStore';

export function SettingsScreen() {
  const { user, signOut } = useAuthStore();
  const [notifications, setNotifications] = useState(true);
  const [haptics, setHaptics] = useState(true);

  const SettingRow = ({ 
    icon, 
    label, 
    value, 
    onPress, 
    isSwitch, 
    switchValue, 
    onSwitchChange 
  }: { 
    icon: string; 
    label: string; 
    value?: string; 
    onPress?: () => void;
    isSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (val: boolean) => void;
  }) => (
    <Pressable 
      style={styles.row} 
      onPress={onPress}
      disabled={isSwitch}
    >
      <View style={styles.rowLeft}>
        <MaterialIcons name={icon as any} size={20} color={Colors.red} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#333', true: Colors.red + '44' }}
          thumbColor={switchValue ? Colors.red : '#666'}
        />
      ) : (
        <View style={styles.rowRight}>
          {value && <Text style={styles.rowValue}>{value}</Text>}
          <MaterialIcons name="chevron-right" size={20} color={Colors.muted} />
        </View>
      )}
    </Pressable>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>PROJECT: CONFIG</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SYSTEM</Text>
        <SettingRow 
          icon="notifications" 
          label="NOTIFICATIONS" 
          isSwitch 
          switchValue={notifications} 
          onSwitchChange={setNotifications} 
        />
        <SettingRow 
          icon="vibration" 
          label="HAPTIC FEEDBACK" 
          isSwitch 
          switchValue={haptics} 
          onSwitchChange={setHaptics} 
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <SettingRow icon="person" label="IDENTITY" value={user?.email || 'v0id_walker'} />
        <SettingRow icon="verified-user" label="SECURITY" />
        <SettingRow icon="history" label="RUN LOGS" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <SettingRow icon="info" label="VERSION" value="1.0.4-BETA" />
        <SettingRow icon="description" label="LEGAL" />
      </View>

      <Pressable style={styles.logoutButton} onPress={() => signOut()}>
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
  title: {
    fontFamily: Fonts.display,
    fontSize: 32,
    color: Colors.white,
    letterSpacing: 4,
    marginBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.red,
    letterSpacing: 2,
    marginBottom: 12,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.muted + '11',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.muted + '22',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    color: Colors.white,
    letterSpacing: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowValue: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    color: Colors.muted,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: Colors.red + '22',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.red,
  },
  logoutText: {
    fontFamily: Fonts.display,
    fontSize: 16,
    color: Colors.red,
    letterSpacing: 2,
  },
});
