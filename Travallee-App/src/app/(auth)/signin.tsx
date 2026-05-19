import React, { useState, useEffect } from 'react';
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
import { API_ENDPOINTS_AUTH } from '@/src/constants/api';
import { isAxiosError } from 'axios';
import apiClient from '@/src/services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/src/context/AuthContext';
import { io } from 'socket.io-client';


export default function SignIn() {
  const API_SIGNIN = API_ENDPOINTS_AUTH.LOGIN;
  const router = useRouter();
  const { user, setSocket } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace('/(tabs)' as any);
    }
  }, [user, router]);
  const [errorMessage, setErrorMessage] = useState('');

  const getApiErrorMessage = (error: unknown) => {
    if (isAxiosError(error)) {
      const responseData = error.response?.data;

      if (!error.response) {
        return 'Cannot reach auth server. Start backend and verify API_BASE_URL.';
      }

      if (typeof responseData?.message === 'string' && responseData.message.trim()) {
        return responseData.message;
      }

      if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
        const firstError = responseData.errors[0];
        if (typeof firstError?.message === 'string' && firstError.message.trim()) {
          return firstError.message;
        }
      }

      if (typeof error.message === 'string' && error.message.trim()) {
        return error.message;
      }
    }

    return 'An error occurred during sign in. Please try again.';
  };

  const handleSignIn = async () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    if (!trimmedUsername || !trimmedPassword) {
      setErrorMessage('Please enter username and password.');
      return;
    }
    setLoading(true);
    setErrorMessage('');

    try {
      const payload = { Username: trimmedUsername, password: trimmedPassword };

      const response = await apiClient.post(API_SIGNIN, payload);

      if (response.status === 200) {
        const token :  string = response.data?.data?.token;
        await SecureStore.setItemAsync('userToken', token);
        await AsyncStorage.setItem('token', token);
        

        const userData = response.data?.data?.data;
        if (userData) {
          await SecureStore.setItemAsync('userData', JSON.stringify(userData));
        }

        const newSocket = io(process.env.EXPO_PUBLIC_SOCKET_URL || 'http://192.168.1.142:6001', {
          auth: {
            token: token,
          },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        });

        newSocket.on('connect', async () => {
          console.log('Socket connected:', newSocket.id);
          await setSocket(newSocket);
        });

        newSocket.on('disconnect', () => {
          console.log('Socket disconnected');
        });

        newSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
        });

        router.replace('/(tabs)' as any);
      }
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };
  

  const handleSignUp = () => {
    router.push('/(auth)/signup' as any);
  };

  const handlePhoneTab = () => {
    router.replace('/(auth)/signin-phone' as any);
  };

  const handleGoogleSignIn = () => {
    console.log('Google Sign In');
    console.log(API_SIGNIN)
  };

  const handleFacebookSignIn = () => {
    console.log('Facebook Sign In');
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
          <TouchableOpacity style={[styles.tab, styles.tabActive]}>
            <Text style={[styles.tabText, styles.tabTextActive]}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={handlePhoneTab}>
            <Text style={styles.tabText}>Phone</Text>
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Please enter your email address</Text>
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
            placeholder="Username"
            value={username }
            onChangeText={(value) => {
              setUsername (value);
              if (errorMessage) setErrorMessage('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.inputContainer}
          />
          
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

          <Button
            title="Continue"
            onPress={handleSignIn}
            loading={loading}
            disabled={!username.trim() || !password.trim()}
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
  inputContainer: {
    marginBottom: Spacing.sm,
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
