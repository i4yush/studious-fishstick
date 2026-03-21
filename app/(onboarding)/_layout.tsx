import React from 'react';
import { Stack } from 'expo-router';
import { BRAND } from '@/utils/constants';

export default function OnboardingLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: BRAND.VOID_BLACK },
                animation: 'fade',
            }}
        />
    );
}
