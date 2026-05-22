import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  RealixColors,
  realixDiscoverProperty,
  realixPaymentMethods,
} from '@/src/constants/screens/realix';
import { API_ENDPOINTS_BOOKING } from '@/src/constants/api';
import apiClient from '@/src/services/apiClient';
import { useAuth } from '@/src/context/AuthContext';
import { useSafeNavigation } from '@/src/hooks/useSafeNavigation';

// ── Section Header with accent bar ──────────────────────────────
function SectionHeader({ label }: { label: string }) {
  return (
    <View style={sectionStyles.row}>
      <View style={sectionStyles.bar} />
      <Text style={sectionStyles.label}>{label}</Text>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bar: { width: 3, height: 14, borderRadius: 2, backgroundColor: RealixColors.accent },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: RealixColors.textPrimary,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
});

// ── Small inline badge ───────────────────────────────────────────
function Tag({ label, color }: { label: string; color: string }) {
  return (
    <View style={[tagStyles.wrap, { backgroundColor: `${color}18`, borderColor: `${color}44` }]}>
      <Text style={[tagStyles.text, { color }]}>{label}</Text>
    </View>
  );
}

const tagStyles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  text: { fontSize: 9, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase' },
});

// ── Price row helper ─────────────────────────────────────────────
function PriceRow({
  label,
  value,
  note,
  accent,
  bold,
}: {
  label: string;
  value: string;
  note?: string;
  accent?: boolean;
  bold?: boolean;
}) {
  return (
    <View style={priceRowStyles.row}>
      <View style={priceRowStyles.left}>
        <Text style={[priceRowStyles.label, bold && priceRowStyles.boldLabel]}>{label}</Text>
        {note ? <Text style={priceRowStyles.note}>{note}</Text> : null}
      </View>
      <Text
        style={[
          priceRowStyles.value,
          accent && priceRowStyles.accentValue,
          bold && priceRowStyles.boldValue,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const priceRowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { fontSize: 12, color: RealixColors.textSecondary },
  note: { fontSize: 10, color: RealixColors.textMuted },
  boldLabel: { fontWeight: '700', color: RealixColors.textPrimary },
  value: { fontSize: 12, fontWeight: '600', color: RealixColors.textPrimary },
  accentValue: { color: '#e05252' },
  boldValue: { fontSize: 16, fontWeight: '800', color: RealixColors.accent },
});

// ── Main screen ──────────────────────────────────────────────────
export default function PaymentScreen() {
  const { goBack } = useSafeNavigation();
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    checkIn,
    checkOut,
    guests,
    hotelName,
    roomType,
    pricePerNight,
    paymentMethod,
    roomId,
    hotelId,
    maxGuests,
  } = useLocalSearchParams<{
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    hotelName?: string;
    roomType?: string;
    pricePerNight?: string;
    paymentMethod?: string;
    roomId?: string;
    hotelId?: string;
    maxGuests?: string;
  }>();

  const nightlyPrice = pricePerNight ? Number(pricePerNight) : realixDiscoverProperty.nightlyPrice;

  const selectedMethodFallback = realixPaymentMethods.some((m) => m.id === paymentMethod)
    ? paymentMethod!
    : realixPaymentMethods[0].id;

  const [selectedMethod, setSelectedMethod] = useState<string>(selectedMethodFallback);

  const guestCount = guests ? Number(guests) : 1;
  const bookingUserId = user?.id || (user as { _id?: string } | null)?._id;

  // Date label helpers
  const formatDateLabel = (iso?: string) => {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  const checkInLabel = formatDateLabel(checkIn);
  const checkOutLabel = formatDateLabel(checkOut);

  // Night count
  const checkInDate = checkIn ? new Date(checkIn) : null;
  const checkOutDate = checkOut ? new Date(checkOut) : null;
  const nights =
    checkInDate && checkOutDate && !isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime())
      ? Math.max(Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 86400000), 0)
      : 0;

  // Pricing
  const roomFee = nights * nightlyPrice;
  const discount = roomFee * 0.15;
  const tax = (roomFee - discount) * 0.13;
  const total = roomFee - discount + tax;

  const bookingParams = {
    roomId,
    hotelId,
    hotelName,
    roomType,
    pricePerNight: String(nightlyPrice),
    maxGuests,
    checkIn,
    checkOut,
    guests,
    paymentMethod: selectedMethod,
  };

  const activeMethod = realixPaymentMethods.find((m) => m.id === selectedMethod);
  const isCashOnDelivery = selectedMethod === 'cod';

  const toIsoDateTime = (value?: string) => {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? '' : date.toISOString();
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return `${value}T00:00:00.000Z`;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString();
  };

  const handleProceed = async () => {
    if (!bookingUserId) {
      Alert.alert('Sign in required', 'Please sign in before creating a booking.');
      return;
    }

    if (!roomId || !hotelId) {
      Alert.alert('Missing information', 'Hotel or room information is missing.');
      return;
    }

    const payload = {
      userId: bookingUserId,
      hotelId,
      roomId,
      hotelName: hotelName || '',
      roomNumber: roomType || '',
      guests: guestCount,
      checkIn: toIsoDateTime(checkIn),
      checkOut: toIsoDateTime(checkOut),
      totalPrice: Number(total.toFixed(2)),
      paymentMethod: selectedMethod.toUpperCase() as 'KHALTI' | 'ESEWA' | 'COD',
      userEmail: user?.email,
      userName: (user as any)?.name || '',
    };

    if (!payload.checkIn || !payload.checkOut) {
      Alert.alert('Missing information', 'Please select valid check-in and check-out dates.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiClient.post(API_ENDPOINTS_BOOKING.CREATE_BOOKING, payload);

      if (!response.data?.success) {
        Alert.alert('Booking Error', response.data?.message || 'Failed to save booking.');
        return;
      }

      router.push({ pathname: '/(tabs)/explore/passcode', params: bookingParams });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to connect to booking service.';
      Alert.alert('Booking Error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.iconBtn} onPress={goBack}>
            <Ionicons name="chevron-back" size={16} color={RealixColors.textPrimary} />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>Payment</Text>
            <Text style={styles.headerSub}>Review & confirm your booking</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="heart-outline" size={15} color={RealixColors.textSecondary} />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="share-outline" size={15} color={RealixColors.textSecondary} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Booking Summary Card ── */}
        <View style={styles.summaryCard}>
          {/* Hotel row */}
          <View style={styles.summaryTop}>
            <View style={styles.summaryThumb}>
              <Ionicons name="business-outline" size={18} color={RealixColors.accent} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryName} numberOfLines={1}>
                {hotelName || 'Cassablanca Ground'}
              </Text>
              <Text style={styles.summaryRoomType}>{roomType || 'Standard Room'}</Text>
              <View style={styles.summaryMeta}>
                <Ionicons name="calendar-outline" size={10} color={RealixColors.textMuted} />
                <Text style={styles.summaryMetaText}>
                  {checkInLabel} — {checkOutLabel}
                </Text>
                <View style={styles.metaDivider} />
                <Ionicons name="people-outline" size={10} color={RealixColors.textMuted} />
                <Text style={styles.summaryMetaText}>
                  {guestCount} guest{guestCount !== 1 ? 's' : ''}
                </Text>
                {nights > 0 && (
                  <>
                    <View style={styles.metaDivider} />
                    <Ionicons name="moon-outline" size={10} color={RealixColors.textMuted} />
                    <Text style={styles.summaryMetaText}>
                      {nights} night{nights !== 1 ? 's' : ''}
                    </Text>
                  </>
                )}
              </View>
            </View>
            <View style={styles.nightlyBadge}>
              <Text style={styles.nightlyValue}>${nightlyPrice}</Text>
              <Text style={styles.nightlyUnit}>/night</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Price breakdown */}
          <View style={styles.section}>
            <SectionHeader label="Price Breakdown" />
            <View style={styles.priceList}>
              <PriceRow
                label="Room fee"
                note={`${nights} night${nights !== 1 ? 's' : ''} × $${nightlyPrice}`}
                value={`$${roomFee.toFixed(2)}`}
              />
              <View style={styles.priceRowWithBadge}>
                <View style={styles.priceRowInner}>
                  <Text style={priceRowStyles.label}>Discount</Text>
                  <Tag label="15% OFF" color="#e05252" />
                </View>
                <Text style={[priceRowStyles.value, { color: '#e05252' }]}>
                  −${discount.toFixed(2)}
                </Text>
              </View>
              <PriceRow label="VAT" note="13%" value={`$${tax.toFixed(2)}`} />
            </View>
          </View>

          {/* Total */}
          <View style={styles.totalCard}>
            <View>
              <Text style={styles.totalCardLabel}>Total Amount</Text>
              <Text style={styles.totalCardSub}>Taxes & discounts included</Text>
            </View>
            <Text style={styles.totalCardValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* ── Payment Methods ── */}
        <View style={styles.paymentCard}>
          <SectionHeader label="Select Payment" />

          <View style={styles.methodList}>
            {realixPaymentMethods.map((method) => {
              const isActive = selectedMethod === method.id;
              return (
                <Pressable
                  key={method.id}
                  style={[styles.methodItem, isActive && styles.methodItemActive]}
                  onPress={() => setSelectedMethod(method.id)}
                >
                  <Text style={[styles.methodLabel, isActive && styles.methodLabelActive]}>
                    {method.label}
                  </Text>
                  {isActive && <Tag label="Selected" color={RealixColors.accent} />}
                  <View style={[styles.radio, isActive && styles.radioActive]}>
                    {isActive && <View style={styles.radioInner} />}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Add new payment */}
          <Pressable
            style={styles.addPaymentBtn}
            onPress={() => router.push('/(tabs)/explore/add-card')}
          >
            <View style={styles.addPaymentIcon}>
              <Ionicons name="add" size={14} color={RealixColors.accent} />
            </View>
            <Text style={styles.addPaymentText}>Add new payment method</Text>
          </Pressable>

          <Text style={styles.termsText}>
            By proceeding with payment you agree to the House Rules, Cancellation Policy, Privacy Policy, and accept any additional hotel-specific terms.
          </Text>
        </View>

      </ScrollView>

      {/* ── Bottom Bar ── */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Paying with</Text>
          <Text style={styles.bottomMethod}>{activeMethod ? activeMethod.label : '—'}</Text>
        </View>
        <Pressable
          style={styles.payBtn}
          onPress={handleProceed}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <>
              <Text style={styles.payBtnText}>
                {isCashOnDelivery ? 'Confirm Booking' : 'Pay Now'}
              </Text>
              <Ionicons name="arrow-forward" size={14} color="#000" />
            </>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ── Root ──
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: RealixColors.textPrimary,
    letterSpacing: -0.3,
  },
  headerSub: { fontSize: 10, color: RealixColors.textMuted, marginTop: 1 },
  headerRight: { flexDirection: 'row', gap: 6 },
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

  // ── Scroll ──
  content: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 24, gap: 12 },

  // ── Summary Card ──
  summaryCard: {
    backgroundColor: RealixColors.cardBackground,
    borderWidth: 1,
    borderColor: RealixColors.border,
    borderRadius: 14,
    overflow: 'hidden',
  },
  summaryTop: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    padding: 14,
  },
  summaryThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: `${RealixColors.accent}18`,
    borderWidth: 1,
    borderColor: `${RealixColors.accent}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryInfo: { flex: 1 },
  summaryName: {
    fontSize: 13,
    fontWeight: '800',
    color: RealixColors.textPrimary,
    letterSpacing: -0.2,
  },
  summaryRoomType: {
    fontSize: 10,
    color: RealixColors.accent,
    fontWeight: '600',
    marginTop: 2,
  },
  summaryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  summaryMetaText: { fontSize: 10, color: RealixColors.textMuted },
  metaDivider: {
    width: 1,
    height: 10,
    backgroundColor: RealixColors.border,
    marginHorizontal: 2,
  },
  nightlyBadge: { alignItems: 'flex-end' },
  nightlyValue: { fontSize: 16, fontWeight: '800', color: RealixColors.textPrimary },
  nightlyUnit: { fontSize: 9, color: RealixColors.textMuted, marginTop: 1 },
  divider: { height: 1, backgroundColor: RealixColors.border },

  // ── Section wrapper ──
  section: { padding: 14, gap: 10 },
  priceList: { gap: 8, marginTop: 4 },
  priceRowWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceRowInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },

  // ── Total card ──
  totalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: `${RealixColors.accent}10`,
    borderTopWidth: 1,
    borderTopColor: `${RealixColors.accent}33`,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  totalCardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },
  totalCardSub: { fontSize: 10, color: RealixColors.textMuted, marginTop: 2 },
  totalCardValue: {
    fontSize: 22,
    fontWeight: '800',
    color: RealixColors.accent,
    letterSpacing: -0.5,
  },

  // ── Payment Card ──
  paymentCard: {
    backgroundColor: RealixColors.cardBackground,
    borderWidth: 1,
    borderColor: RealixColors.border,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  methodList: { gap: 8 },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: RealixColors.inputBackground,
    borderWidth: 1,
    borderColor: RealixColors.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  methodItemActive: {
    borderColor: `${RealixColors.accent}88`,
    backgroundColor: `${RealixColors.accent}0d`,
  },
  methodLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: RealixColors.textSecondary,
  },
  methodLabelActive: { color: RealixColors.textPrimary },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: RealixColors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: RealixColors.accent },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: RealixColors.accent,
  },

  // ── Add payment ──
  addPaymentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: RealixColors.border,
    borderRadius: 10,
    borderStyle: 'dashed',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addPaymentIcon: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: `${RealixColors.accent}18`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPaymentText: { fontSize: 12, color: RealixColors.textMuted, fontWeight: '500' },

  termsText: {
    fontSize: 10,
    lineHeight: 15,
    color: RealixColors.textMuted,
  },

  // ── Bottom Bar ──
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: RealixColors.border,
    backgroundColor: RealixColors.screenBackground,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomLabel: {
    fontSize: 10,
    color: RealixColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  bottomMethod: {
    fontSize: 13,
    fontWeight: '700',
    color: RealixColors.textPrimary,
    marginTop: 2,
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: RealixColors.accent,
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  payBtnText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});