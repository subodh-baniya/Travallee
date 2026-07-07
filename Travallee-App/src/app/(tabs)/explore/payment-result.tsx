import React, { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealixColors } from '@/src/constants/screens/realix';

export default function PaymentResultScreen() {
  const router = useRouter();
  const { status, bookingId } = useLocalSearchParams<{
    status?: string;
    bookingId?: string;
  }>();

  const isSuccess = status === 'success';

  // Entrance animations
  const scaleAnim = useRef(new Animated.Value(0.4)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(30)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 100, friction: 8 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(cardAnim, { toValue: 0, duration: 320, useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 1, duration: 320, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="light" />

      <View style={styles.content}>
        {/* ── Success/Failure Icon ── */}
        <View style={styles.iconArea}>
          <View style={[styles.ring3, { borderColor: isSuccess ? `${RealixColors.accent}0f` : '#e052520f' }]} />
          <View style={[styles.ring2, { borderColor: isSuccess ? `${RealixColors.accent}22` : '#e0525222' }]} />
          <View style={[styles.ring1, { borderColor: isSuccess ? `${RealixColors.accent}44` : '#e0525244' }]} />
          <Animated.View
            style={[
              styles.iconCircle,
              { 
                transform: [{ scale: scaleAnim }], 
                opacity: opacityAnim,
                backgroundColor: isSuccess ? RealixColors.accent : '#e05252'
              },
            ]}
          >
            <Ionicons name={isSuccess ? "checkmark" : "close"} size={34} color="#000" />
          </Animated.View>
        </View>

        {/* ── Title ── */}
        <Animated.View style={[styles.titleArea, { opacity: opacityAnim }]}>
          <Text style={styles.title}>
            {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </Text>
          <Text style={styles.subtitle}>
            {isSuccess 
              ? 'Your payment was processed and the reservation has been successfully confirmed.'
              : 'There was an issue processing your payment. Please try again.'}
          </Text>
        </Animated.View>

        {/* ── Booking ref ── */}
        {bookingId && (
          <Animated.View
            style={[
              styles.summaryCard,
              { transform: [{ translateY: cardAnim }], opacity: cardOpacity },
            ]}
          >
            <View style={styles.refCard}>
              <Text style={styles.refLabel}>Booking Reference</Text>
              <Text style={styles.refValue}>#{bookingId.slice(-6).toUpperCase()}</Text>
            </View>
          </Animated.View>
        )}
      </View>

      {/* ── Bottom Actions ── */}
      <View style={styles.bottomBar}>
        <Pressable
          style={styles.primaryBtn}
          onPress={() => router.replace('/(tabs)/explore')}
        >
          <Text style={styles.primaryBtnText}>
            {isSuccess ? 'Continue Exploring' : 'Go Back to Explore'}
          </Text>
          <Ionicons name="arrow-forward" size={14} color="#000" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RealixColors.pageBackground,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  iconArea: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
  },
  ring2: {
    position: 'absolute',
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 1,
  },
  ring1: {
    position: 'absolute',
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 1,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  titleArea: { alignItems: 'center', gap: 6 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: RealixColors.textPrimary,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: RealixColors.textMuted,
    textAlign: 'center',
    maxWidth: 280,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: RealixColors.cardBackground,
    borderWidth: 1,
    borderColor: RealixColors.border,
    borderRadius: 16,
    overflow: 'hidden',
  },
  refCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: RealixColors.inputBackground,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  refLabel: { fontSize: 12, color: RealixColors.textMuted, fontWeight: '600', letterSpacing: 0.3 },
  refValue: {
    fontSize: 14,
    fontWeight: '800',
    color: RealixColors.textPrimary,
    letterSpacing: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: RealixColors.border,
    backgroundColor: RealixColors.screenBackground,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    borderRadius: 12,
    backgroundColor: RealixColors.accent,
  },
  primaryBtnText: { fontSize: 13, fontWeight: '800', color: '#000' },
});
