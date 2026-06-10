// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/src/constants/app/color';
import { AuthProvider } from '@/src/context/AuthContext';
import { useLocationInitialization } from '@/src/hooks/useLocationInitialization';

export default function RootLayout() {
  // Initialize location permission request on app startup
  useLocationInitialization();

  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor={Colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="splash" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen
          name="(tabs)"
          options={{
            gestureEnabled: false,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}