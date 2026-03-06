import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuthStore } from '@/stores/useAuthStore';
import { analyticsService } from '@/services/analyticsService';

export function SettingsScreen() {
    const { user, signOut } = useAuthStore();

    const handleSignOut = async () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => {
                    analyticsService.reset();
                    await signOut();
                },
            },
        ]);
    };

    const SettingRow = ({ label, value, onPress }: { label: string; value?: string; onPress?: () => void }) => (
        <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
            <Text style={styles.rowLabel}>{label}</Text>
            {value && <Text style={styles.rowValue}>{value}</Text>}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
            <Text style={styles.heading}>Settings ⚙️</Text>

            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.section}>
                <SettingRow label="Email" value={user?.email ?? '—'} />
                <SettingRow label="User ID" value={user?.id.slice(0, 8) + '...' ?? '—'} />
            </View>

            <Text style={styles.sectionTitle}>Subscription</Text>
            <View style={styles.section}>
                <SettingRow label="Upgrade to Premium" onPress={() => {/* open paywall */ }} />
                <SettingRow label="Restore Purchases" onPress={() => {/* restore */ }} />
            </View>

            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.section}>
                <SettingRow label="Push Notifications" value="Enabled" />
                <SettingRow label="Streak Reminders" value="On" />
            </View>

            <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.85}>
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: '#0F0F0F' },
    content: { padding: 24, gap: 12, paddingTop: 60 },
    heading: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 8 },
    sectionTitle: { color: '#9CA3AF', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginTop: 8 },
    section: {
        backgroundColor: '#1A1A2E',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#2D2D4D',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2D2D4D',
    },
    rowLabel: { color: '#fff', fontSize: 15 },
    rowValue: { color: '#6B7280', fontSize: 14 },
    signOutBtn: {
        marginTop: 16,
        backgroundColor: '#EF4444',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
    },
    signOutText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
