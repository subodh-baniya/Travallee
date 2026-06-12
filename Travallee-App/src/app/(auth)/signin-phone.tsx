import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Input, SocialButton, Divider, FormFeedback } from '@/src/components/realix/ui';
import { Colors } from '@/src/constants/app/color';
import { Typography } from '@/src/constants/app/typography';
import { Spacing } from '@/src/constants/app/spacing';

export default function SignInPhone() {
  const router = useRouter();
  const [countryCode] = useState('+977');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
    const trimmedPhone = phoneNumber.trim();
    if (!trimmedPhone) {
      setErrorMessage('Please enter your phone number.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/(auth)/verify-code',
        params: { phone: `${countryCode}${trimmedPhone}` },
      } as any);
    }, 600);
  };

  const handleSignUp = () => {
    router.push('/(auth)/signup-phone' as any);
  };

  const handleEmailTab = () => {
    router.replace('/(auth)/signin' as any);
  };

  const handleGoogleSignIn = () => {
  };

  const handleFacebookSignIn = () => {
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={styles.tab} onPress={handleEmailTab}>
            <Text style={styles.tabText}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, styles.tabActive]}>
            <Text style={[styles.tabText, styles.tabTextActive]}>Phone</Text>
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Please enter your phone number</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <FormFeedback
            message={errorMessage}
            type="error"
            style={styles.feedback}
            onDismiss={() => setErrorMessage('')}
          />

          <View style={styles.phoneRow}>
            <TouchableOpacity style={styles.countryCodeButton}>
              <Text style={styles.countryCodeText}>{countryCode}</Text>
            </TouchableOpacity>
            <View style={styles.phoneInputContainer}>
              <Input
                placeholder="Phone number"
                value={phoneNumber}
                onChangeText={(value) => {
                  setPhoneNumber(value);
                  if (errorMessage) setErrorMessage('');
                }}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <Button
            title="Continue"
            onPress={handleSignIn}
            loading={loading}
            disabled={!phoneNumber.trim()}
            style={styles.signInButton}
          />
        </View>

        {/* Social Login */}
        <Divider text="Or Sign In with" style={styles.divider} />
        
        <View style={styles.socialButtons}>
          <SocialButton
            provider="google"
            onPress={handleGoogleSignIn}
          />
          <SocialButton
            provider="facebook"
            onPress={handleFacebookSignIn}
          />
        </View>

        {/* Sign Up Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don&apos;t have account? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: Spacing.borderRadius.md,
    padding: 4,
    marginBottom: Spacing.xl,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: Spacing.borderRadius.sm,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    ...Typography.button,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.buttonText,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  form: {
    gap: Spacing.md,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  countryCodeButton: {
    height: Spacing.inputHeight,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.cardBackground,
    borderRadius: Spacing.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCodeText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  phoneInputContainer: {
    flex: 1,
  },
  feedback: {
    marginBottom: Spacing.sm,
  },
  signInButton: {
    marginTop: Spacing.md,
  },
  divider: {
    marginVertical: Spacing.lg,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: Spacing.xl,
  },
  footerText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  footerLink: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
});
