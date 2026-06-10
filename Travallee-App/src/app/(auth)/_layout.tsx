import { Stack } from 'expo-router';
import { Colors } from '@/src/constants/app/color';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="signin" />
      <Stack.Screen name="signin-phone" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="signup-phone" />
      <Stack.Screen name="verify-code" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
