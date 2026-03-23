import { Stack } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function RunLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.black },
        presentation: 'fullScreenModal',
      }}
    />
  );
}
