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
import { Button, Input, SocialButton, Divider, Checkbox, FormFeedback } from '@/src/components/realix/ui';
import { Colors } from '@/src/constants/app/color';
import { Typography } from '@/src/constants/app/typography';
import { Spacing } from '@/src/constants/app/spacing';

export default function SignUpPhone() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [countryCode] = useState('+977');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = async () => {
    const trimmedName = name.trim();
    const trimmedPhone = phoneNumber.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedPhone || !trimmedPassword) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    if (!agreeToTerms) {
      setErrorMessage('Please accept Terms of Service and Privacy Policy.');
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

  const handleSignIn = () => {
    router.push('/(auth)/signin-phone' as any);
  };

  const handleEmailTab = () => {
    router.replace('/(auth)/signup' as any);
  };

  const handleGoogleSignUp = () => {
  };

  const handleFacebookSignUp = () => {
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
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>Create your account to get started</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <FormFeedback
            message={errorMessage}
            type="error"
            style={styles.feedback}
            onDismiss={() => setErrorMessage('')}
          />

          <Input
            placeholder="Name"
            value={name}
            onChangeText={(value) => {
              setName(value);
              if (errorMessage) setErrorMessage('');
            }}
            autoCapitalize="words"
            containerStyle={styles.inputContainer}
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
          
          <Input
            placeholder="Password"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              if (errorMessage) setErrorMessage('');
            }}
            isPassword
            containerStyle={styles.inputContainer}
          />

          {/* Terms Checkbox */}
          <Checkbox
            checked={agreeToTerms}
            onToggle={() => {
              setAgreeToTerms(!agreeToTerms);
              if (errorMessage) setErrorMessage('');
            }}
            labelComponent={
              <Text style={styles.termsText}>
                I agree to{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            }
            style={styles.checkbox}
          />

          <Button
            title="Continue"
            onPress={handleSignUp}
            loading={loading}
            disabled={!name.trim() || !phoneNumber.trim() || !password.trim() || !agreeToTerms}
            style={styles.continueButton}
          />
        </View>

        {/* Social SignUp */}
        <Divider text="Or Sign Up with" style={styles.divider} />
        
        <View style={styles.socialButtons}>
          <SocialButton
            provider="google"
            onPress={handleGoogleSignUp}
          />
          <SocialButton
            provider="facebook"
            onPress={handleFacebookSignUp}
          />
        </View>

        {/* Sign In Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have account? </Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.footerLink}>Sign In</Text>
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
  inputContainer: {
    marginBottom: Spacing.xs,
  },
  feedback: {
    marginBottom: Spacing.sm,
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
  checkbox: {
    marginTop: Spacing.sm,
  },
  termsText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
  },
  termsLink: {
    color: Colors.primary,
  },
  continueButton: {
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
