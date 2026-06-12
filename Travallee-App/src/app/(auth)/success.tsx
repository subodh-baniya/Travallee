import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/src/components/realix/ui';
import { Colors } from '@/src/constants/app/color';
import { Typography } from '@/src/constants/app/typography';
import { Spacing } from '@/src/constants/app/spacing';

export default function Success() {
  const router = useRouter();

  const handleGoCreate = async () => {
    router.replace('/(auth)/signin' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={48} color={Colors.textPrimary} />
          </View>
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Thank You for Joining Travallee</Text>
        <Text style={styles.message}>
          Your profile is ready. Discover great stays, compare prices, and book
          your next trip with confidence. Please login to continue.
        </Text>
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <Button
          title="Login"
          onPress={handleGoCreate}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    ...Typography.body,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  bottomContainer: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: Spacing.xxl,
  },
  button: {
    width: '100%',
  },
});
