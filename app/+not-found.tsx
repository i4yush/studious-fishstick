import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function NotFound() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text style={styles.code}>404</Text>
            <Text style={styles.title}>Page not found</Text>
            <TouchableOpacity onPress={() => router.replace('/')} style={styles.btn}>
                <Text style={styles.btnText}>Go Home</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    code: { color: '#7C3AED', fontSize: 72, fontWeight: '900' },
    title: { color: '#fff', fontSize: 20, fontWeight: '600' },
    btn: {
        marginTop: 8,
        backgroundColor: '#7C3AED',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 12,
    },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
