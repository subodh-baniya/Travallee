import React, { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import apiClient from '@/src/services/apiClient';
import { API_ENDPOINTS_BOOKING } from '@/src/constants/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealixColors } from '@/src/constants/screens/realix';
import { useSafeNavigation } from '@/src/hooks/useSafeNavigation';
import { registerComponentStyleBuilder } from 'react-native-reanimated/lib/typescript/css/native';

const numberRows = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', '⌫'],
] as const;

const OTP_LENGTH = 4;

export default function PasscodeScreen() {
  const router = useRouter();
  const { goBack } = useSafeNavigation();

  const {
    roomId, hotelId, hotelName, roomType,
    pricePerNight, checkIn, checkOut,
    guests, paymentMethod, maxGuests,
  } = useLocalSearchParams<{
    roomId?: string; hotelId?: string; hotelName?: string;
    roomType?: string; pricePerNight?: string; checkIn?: string;
    checkOut?: string; guests?: string; paymentMethod?: string; maxGuests?: string;
  }>();

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Shake animation on error
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const pushDigit = (digit: string) => {
    if (isSubmitting) return;
    setHasError(false);

    if (digit === '⌫') {
      setDigits(prev => {
        const next = [...prev];
        const idx = next.findLastIndex(d => d !== '');
        if (idx >= 0) next[idx] = '';
        return next;
      });
      return;
    }

    if (!digit) return;

    setDigits(prev => {
      const next = [...prev];
      const idx = next.findIndex(d => d === '');
      if (idx < 0) return prev;
      next[idx] = digit;

      if (idx === OTP_LENGTH - 1) {
        const code = next.join('');
        verifyOtp(code);
      }

      return next;
    });
  };

  const verifyOtp = async (code: string) => {
    setIsSubmitting(true);
    try {
      const resp = await apiClient.post(API_ENDPOINTS_BOOKING.VERIFY_OTP, { otp: code });
      if (resp?.data?.success) {
        router.replace({
          pathname: '/(tabs)/explore/success',
          params: { roomId, hotelId, hotelName, roomType, pricePerNight, checkIn, checkOut, guests, paymentMethod, maxGuests },
        });
      } else {
        setHasError(true);
        triggerShake();
        Alert.alert('Invalid OTP', resp?.data?.message || 'Please try again.');
        setDigits(Array(OTP_LENGTH).fill(''));
      }
    } catch (error: any) {
      setHasError(true);
      triggerShake();
      Alert.alert('OTP Error', error?.response?.data?.message || 'Failed to verify. Please try again.');
      setDigits(Array(OTP_LENGTH).fill(''));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filledCount = digits.filter(d => d !== '').length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable style={styles.iconBtn} onPress={goBack}>
          <Ionicons name="chevron-back" size={16} color={RealixColors.textPrimary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Verify OTP</Text>
          <Text style={styles.headerSub}>Enter the code sent to your email</Text>
        </View>
        {/* Spacer to balance the back button */}
        <View style={styles.iconBtnPlaceholder} />
      </View>

      {/* ── Body ── */}
      <View style={styles.body}>

        {/* Lock / Shield icon */}
        <View style={styles.shieldWrap}>
          <View style={styles.shieldIcon}>
            <Ionicons name="shield-checkmark-outline" size={28} color={RealixColors.accent} />
          </View>
          <View style={styles.shieldRing1} />
          <View style={styles.shieldRing2} />
        </View>

        <Text style={styles.bodyTitle}>Two-Step Verification</Text>
        <Text style={styles.bodySubtitle}>
          We've sent a 4-digit code to your registered email address. Enter it below to complete your booking.
        </Text>

        {/* OTP Dots */}
        <Animated.View style={[styles.dotsRow, { transform: [{ translateX: shakeAnim }] }]}>
          {digits.map((digit, index) => {
            const isFilled = digit !== '';
            const isNext = index === filledCount;
            const isError = hasError;
            return (
              <View
                key={index}
                style={[
                  styles.dotBox,
                  isFilled && styles.dotBoxFilled,
                  isNext && !isFilled && styles.dotBoxActive,
                  isError && styles.dotBoxError,
                ]}
              >
                {isFilled ? (
                  <View style={[styles.dotBullet, isError && styles.dotBulletError]} />
                ) : (
                  <View style={styles.dotPlaceholder} />
                )}
              </View>
            );
          })}
        </Animated.View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: `${(filledCount / OTP_LENGTH) * 100}%`,
                backgroundColor: hasError ? '#e05252' : RealixColors.accent,
              },
            ]}
          />
        </View>

        {isSubmitting && (
          <View style={styles.submittingRow}>
            <ActivityIndicator size="small" color={RealixColors.accent} />
            <Text style={styles.submittingText}>Verifying…</Text>
          </View>
        )}

        {hasError && (
          <Text style={styles.errorText}>Incorrect code. Please try again.</Text>
        )}
      </View>

      {/* ── Numpad ── */}
      <View style={styles.pad}>
        {numberRows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.padRow}>
            {row.map((key) => {
              const isBackspace = key === '⌫';
              const isEmpty = key === '';
              return (
                <Pressable
                  key={key || `empty-${rowIdx}`}
                  style={({ pressed }) => [
                    styles.key,
                    isEmpty && styles.keyEmpty,
                    isBackspace && styles.keyBackspace,
                    pressed && !isEmpty && styles.keyPressed,
                  ]}
                  disabled={isEmpty || isSubmitting}
                  onPress={() => pushDigit(key)}
                >
                  {isBackspace ? (
                    <Ionicons name="backspace-outline" size={20} color={RealixColors.textSecondary} />
                  ) : (
                    <Text style={[styles.keyText, isEmpty && styles.keyTextHidden]}>{key}</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}

        {/* Resend hint */}
        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn't receive a code?</Text>
          <Pressable>
            <Text style={styles.resendLink}>Resend OTP</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RealixColors.pageBackground,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: RealixColors.border,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: RealixColors.border,
    backgroundColor: RealixColors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnPlaceholder: { width: 34 },
  headerCenter: { alignItems: 'center' },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: RealixColors.textPrimary,
    letterSpacing: -0.3,
  },
  headerSub: { fontSize: 10, color: RealixColors.textMuted, marginTop: 1 },

  // ── Body ──
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 14,
  },

  // Shield icon stack
  shieldWrap: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  shieldIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: `${RealixColors.accent}18`,
    borderWidth: 1,
    borderColor: `${RealixColors.accent}44`,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  shieldRing1: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${RealixColors.accent}22`,
  },
  shieldRing2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: `${RealixColors.accent}10`,
  },

  bodyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: RealixColors.textPrimary,
    letterSpacing: -0.3,
  },
  bodySubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: RealixColors.textMuted,
    textAlign: 'center',
  },

  // OTP dots
  dotsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  dotBox: {
    width: 52,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: RealixColors.border,
    backgroundColor: RealixColors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotBoxFilled: {
    borderColor: RealixColors.accent,
    backgroundColor: `${RealixColors.accent}10`,
  },
  dotBoxActive: {
    borderColor: `${RealixColors.accent}66`,
    borderStyle: 'dashed',
  },
  dotBoxError: {
    borderColor: '#e05252',
    backgroundColor: '#e0525210',
  },
  dotBullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: RealixColors.accent,
  },
  dotBulletError: {
    backgroundColor: '#e05252',
  },
  dotPlaceholder: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: RealixColors.border,
  },

  // Progress
  progressTrack: {
    width: '100%',
    height: 3,
    borderRadius: 2,
    backgroundColor: RealixColors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
  },

  submittingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  submittingText: { fontSize: 12, color: RealixColors.textMuted },
  errorText: { fontSize: 12, color: '#e05252', fontWeight: '600' },

  // ── Numpad ──
  pad: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  padRow: { flexDirection: 'row', gap: 10 },
  key: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    backgroundColor: RealixColors.cardBackground,
    borderWidth: 1,
    borderColor: RealixColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyEmpty: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  keyBackspace: {
    backgroundColor: RealixColors.inputBackground,
    borderColor: RealixColors.border,
  },
  keyPressed: {
    backgroundColor: `${RealixColors.accent}20`,
    borderColor: `${RealixColors.accent}66`,
  },
  keyText: {
    fontSize: 20,
    fontWeight: '600',
    color: RealixColors.textPrimary,
    letterSpacing: -0.3,
  },
  keyTextHidden: { opacity: 0 },

  // Resend
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 4,
  },
  resendText: { fontSize: 12, color: RealixColors.textMuted },
  resendLink: { fontSize: 12, color: RealixColors.accent, fontWeight: '700' },
});