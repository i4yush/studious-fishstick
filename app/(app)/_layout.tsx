import React, { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotifications } from '@/hooks/useNotifications';
import { Colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { View, StyleSheet, Pressable } from 'react-native';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

function TabIcon({
  name,
  focused,
  color,
}: {
  name: IconName;
  focused: boolean;
  color: string;
}) {
  return (
    <MaterialIcons
      name={name}
      size={24}
      color={focused ? Colors.red : Colors.muted}
    />
  );
}

export default function AppLayout() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  // Auth guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Setup push notifications
  useNotifications({ userId: user?.id });

  if (!isAuthenticated) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.black,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.red,
        tabBarInactiveTintColor: Colors.muted,
        tabBarLabelStyle: {
          fontSize: 10,
          letterSpacing: 0.5,
          fontFamily: 'SpaceMono',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} color={Colors.red} />
          ),
        }}
      />
      <Tabs.Screen
        name="map/index"
        options={{
          title: 'Territory',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="map" focused={focused} color={Colors.red} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard/index"
        options={{
          title: 'Rankings',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="leaderboard" focused={focused} color={Colors.red} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person" focused={focused} color={Colors.red} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards/index"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="military-tech" focused={focused} color={Colors.red} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="settings" focused={focused} color={Colors.red} />
          ),
        }}
      />
      <Tabs.Screen
        name="squads/index"
        options={{
          title: 'Squads',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="groups" focused={focused} color={Colors.red} />
          ),
        }}
      />

      {/* Hidden routes */}
      <Tabs.Screen name="rewards/[id]" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
