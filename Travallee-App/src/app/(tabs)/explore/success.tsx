import React, { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealixColors } from '@/src/constants/screens/realix';

// ── Booking detail row ───────────────────────────────────────────
function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={detailRowStyles.row}>
      <View style={detailRowStyles.iconWrap}>
        <Ionicons name={icon as any} size={13} color={RealixColors.accent} />
      </View>
      <View style={detailRowStyles.info}>
        <Text style={detailRowStyles.label}>{label}</Text>
        <Text style={detailRowStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

const detailRowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: `${RealixColors.accent}18`,
    borderWidth: 1,
    borderColor: `${RealixColors.accent}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  label: { fontSize: 10, color: RealixColors.textMuted, textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: '600' },
  value: { fontSize: 13, fontWeight: '700', color: RealixColors.textPrimary, marginTop: 1 },
});

// ── Main screen ──────────────────────────────────────────────────
export default function ExploreSuccessScreen() {
  const router = useRouter();

  const {
    hotelName,
    roomType,
    checkIn,
    checkOut,
    guests,
    paymentMethod,
    pricePerNight,
  } = useLocalSearchParams<{
    hotelName?: string;
    roomType?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    paymentMethod?: string;
    pricePerNight?: string;
  }>();

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

  // Date formatting
  const formatDate = (iso?: string) => {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const guestCount = Number(guests) || 1;

  // Night count
  const nights = (() => {
    if (!checkIn || !checkOut) return 0;
    const a = new Date(checkIn), b = new Date(checkOut);
    if (isNaN(a.getTime()) || isNaN(b.getTime())) return 0;
    return Math.max(Math.round((b.getTime() - a.getTime()) / 86400000), 0);
  })();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="light" />

      <View style={styles.content}>

        {/* ── Success Icon ── */}
        <View style={styles.iconArea}>
          {/* Outer glow rings */}
          <View style={styles.ring3} />
          <View style={styles.ring2} />
          <View style={styles.ring1} />
          {/* Icon circle */}
          <Animated.View
            style={[
              styles.iconCircle,
              { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
            ]}
          >
            <Ionicons name="checkmark" size={34} color="#000" />
          </Animated.View>
        </View>

        {/* ── Title ── */}
        <Animated.View style={[styles.titleArea, { opacity: opacityAnim }]}>
          <Text style={styles.title}>Booking Confirmed!</Text>
          <Text style={styles.subtitle}>
            Your OTP was verified and the reservation has been successfully created.
          </Text>
        </Animated.View>

        {/* ── Booking Summary Card ── */}
        <Animated.View
          style={[
            styles.summaryCard,
            { transform: [{ translateY: cardAnim }], opacity: cardOpacity },
          ]}
        >
          {/* Card header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.cardThumb}>
                <Ionicons name="business-outline" size={16} color={RealixColors.accent} />
              </View>
              <View>
                <Text style={styles.cardHotelName} numberOfLines={1}>
                  {hotelName || 'Hotel'}
                </Text>
                <Text style={styles.cardRoomType}>{roomType || 'Standard Room'}</Text>
              </View>
            </View>
            <View style={styles.confirmedBadge}>
              <View style={styles.confirmedDot} />
              <Text style={styles.confirmedText}>Confirmed</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Detail rows */}
          <View style={styles.detailList}>
            {checkIn && (
              <DetailRow
                icon="log-in-outline"
                label="Check In"
                value={formatDate(checkIn)}
              />
            )}
            {checkOut && (
              <DetailRow
                icon="log-out-outline"
                label="Check Out"
                value={formatDate(checkOut)}
              />
            )}
            {nights > 0 && (
              <DetailRow
                icon="moon-outline"
                label="Duration"
                value={`${nights} night${nights !== 1 ? 's' : ''}`}
              />
            )}
            <DetailRow
              icon="people-outline"
              label="Guests"
              value={`${guestCount} guest${guestCount !== 1 ? 's' : ''}`}
            />
            {paymentMethod && (
              <DetailRow
                icon="wallet-outline"
                label="Payment"
                value={paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
              />
            )}
          </View>

          {/* Booking ref */}
          <View style={styles.refCard}>
            <Text style={styles.refLabel}>Booking Reference</Text>
            <Text style={styles.refValue}>
              #BK{Math.random().toString(36).slice(2, 8).toUpperCase()}
            </Text>
          </View>
        </Animated.View>

      </View>

      {/* ── Bottom Actions ── */}
      <View style={styles.bottomBar}>
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => router.replace('/(tabs)/explore')}
        >
          <Ionicons name="search-outline" size={15} color={RealixColors.textSecondary} />
          <Text style={styles.secondaryBtnText}>Explore More</Text>
        </Pressable>
        <Pressable
          style={styles.primaryBtn}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.primaryBtnText}>Go to Home</Text>
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

  // ── Icon area ──
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
    borderColor: `${RealixColors.accent}0f`,
  },
  ring2: {
    position: 'absolute',
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 1,
    borderColor: `${RealixColors.accent}22`,
  },
  ring1: {
    position: 'absolute',
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 1,
    borderColor: `${RealixColors.accent}44`,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: RealixColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  // ── Title ──
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

  // ── Summary card ──
  summaryCard: {
    width: '100%',
    backgroundColor: RealixColors.cardBackground,
    borderWidth: 1,
    borderColor: RealixColors.border,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardThumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: `${RealixColors.accent}18`,
    borderWidth: 1,
    borderColor: `${RealixColors.accent}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHotelName: {
    fontSize: 13,
    fontWeight: '800',
    color: RealixColors.textPrimary,
    letterSpacing: -0.2,
    maxWidth: 160,
  },
  cardRoomType: { fontSize: 10, color: RealixColors.accent, fontWeight: '600', marginTop: 2 },
  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: `${RealixColors.accent}15`,
    borderWidth: 1,
    borderColor: `${RealixColors.accent}44`,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  confirmedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: RealixColors.accent,
  },
  confirmedText: { fontSize: 10, color: RealixColors.accent, fontWeight: '700' },

  divider: { height: 1, backgroundColor: RealixColors.border },

  detailList: { padding: 14, gap: 12 },

  // Ref card
  refCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: RealixColors.inputBackground,
    borderTopWidth: 1,
    borderTopColor: RealixColors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  refLabel: { fontSize: 11, color: RealixColors.textMuted, fontWeight: '600', letterSpacing: 0.3 },
  refValue: {
    fontSize: 13,
    fontWeight: '800',
    color: RealixColors.textPrimary,
    letterSpacing: 1,
  },

  // ── Bottom bar ──
  bottomBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: RealixColors.border,
    backgroundColor: RealixColors.screenBackground,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: RealixColors.border,
    backgroundColor: RealixColors.cardBackground,
  },
  secondaryBtnText: { fontSize: 13, fontWeight: '700', color: RealixColors.textSecondary },
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