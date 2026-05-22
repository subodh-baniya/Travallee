import React, { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  RealixColors,
  realixDiscoverProperty,
} from '@/src/constants/screens/realix';

type DayCell = { day: number; month: 'prev' | 'current' | 'next' };

const weekdayLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;
const daysInMonth = 31;
const firstWeekdayOffset = 1;

// Pill badge component
function Badge({ label }: { label: string }) {
  return (
    <View style={badgeStyles.badge}>
      <Text style={badgeStyles.text}>{label}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    backgroundColor: `${RealixColors.accent}22`,
    borderWidth: 1,
    borderColor: `${RealixColors.accent}55`,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  text: {
    fontSize: 9,
    color: RealixColors.accent,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

// Section header with accent line
function SectionHeader({ label }: { label: string }) {
  return (
    <View style={sectionHeaderStyles.row}>
      <View style={sectionHeaderStyles.line} />
      <Text style={sectionHeaderStyles.label}>{label}</Text>
    </View>
  );
}

const sectionHeaderStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  line: { width: 3, height: 14, borderRadius: 2, backgroundColor: RealixColors.accent },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: RealixColors.textPrimary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});

export default function SelectDateScreen() {
  const router = useRouter();

  const handleGoBack = () => {
    try {
      if (router.canGoBack?.()) {
        router.back();
      } else {
        router.replace('/(tabs)/explore');
      }
    } catch {
      router.replace('/(tabs)/explore');
    }
  };

  const { roomId, hotelId, hotelName, roomType, pricePerNight, maxGuests } = useLocalSearchParams<{
    roomId?: string;
    hotelId?: string;
    hotelName?: string;
    roomType?: string;
    pricePerNight?: string;
    maxGuests?: string;
  }>();

  const actualPrice = pricePerNight ? parseInt(pricePerNight) : realixDiscoverProperty.nightlyPrice;
  const maxGuestCount = maxGuests ? parseInt(maxGuests) : 2;

  const [guestCount, setGuestCount] = useState(1);
  const [checkIn, setCheckIn] = useState<number | null>(null);
  const [checkOut, setCheckOut] = useState<number | null>(null);

  const dayCells = useMemo<DayCell[]>(() => {
    const prev = Array.from({ length: firstWeekdayOffset }, (_, i) => ({
      day: 31 - firstWeekdayOffset + i + 1,
      month: 'prev' as const,
    }));
    const curr = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      month: 'current' as const,
    }));
    const nextCount = 42 - (prev.length + curr.length);
    const next = Array.from({ length: nextCount }, (_, i) => ({
      day: i + 1,
      month: 'next' as const,
    }));
    return [...prev, ...curr, ...next];
  }, []);

  const inRange = (day: number) =>
    checkIn !== null && checkOut !== null && day > checkIn && day < checkOut;

  const getMonthYear = () => {
    const d = new Date();
    return `${['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()]} ${d.getFullYear()}`;
  };

  const getMonthShort = () => {
    const d = new Date();
    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
  };

  const onSelectDay = (day: number) => {
    if (checkIn === null || (checkIn !== null && checkOut !== null)) {
      setCheckIn(day);
      setCheckOut(null);
      return;
    }
    if (day <= checkIn) {
      setCheckIn(day);
      setCheckOut(null);
      return;
    }
    setCheckOut(day);
  };

  const isSelectionComplete = checkIn !== null && checkOut !== null;

  const formatBookingDate = (day: number): string => {
    const today = new Date();
    const date = new Date(today.getFullYear(), today.getMonth(), day);
    return date.toISOString().split('T')[0];
  };

  const handleContinueToPayment = () => {
    if (!roomId || !hotelId || !checkIn || !checkOut) {
      Alert.alert('Missing information', 'Please select your stay dates first.');
      return;
    }
    router.push({
      pathname: '/(tabs)/explore/payment',
      params: {
        roomId: roomId ?? '',
        hotelId: hotelId ?? '',
        hotelName: hotelName ?? '',
        roomType: roomType ?? '',
        pricePerNight: String(actualPrice),
        maxGuests: String(maxGuestCount),
        checkIn: formatBookingDate(checkIn),
        checkOut: formatBookingDate(checkOut),
        guests: String(guestCount),
      },
    });
  };

  const nights = isSelectionComplete ? checkOut! - checkIn! : 0;
  const roomFee = nights * actualPrice;
  const discount = roomFee * 0.15;
  const tax = (roomFee - discount) * 0.13;
  const total = roomFee - discount + tax;

  // Range edge helpers
  const isRangeStart = (day: number) => checkIn !== null && checkOut !== null && day === checkIn;
  const isRangeEnd = (day: number) => checkIn !== null && checkOut !== null && day === checkOut;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.iconBtn} onPress={handleGoBack}>
            <Ionicons name="chevron-back" size={16} color={RealixColors.textPrimary} />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>Select Dates</Text>
            <Text style={styles.headerSub}>Choose your stay window</Text>
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

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Date Pickers ── */}
        <View style={styles.dateRow}>
          <View style={[styles.datePill, checkIn !== null && styles.datePillActive]}>
            <View style={styles.datePillIcon}>
              <Ionicons name="log-in-outline" size={13} color={checkIn !== null ? RealixColors.accent : RealixColors.textMuted} />
            </View>
            <View>
              <Text style={styles.datePillLabel}>Check In</Text>
              <Text style={[styles.datePillValue, checkIn === null && styles.datePillPlaceholder]}>
                {checkIn === null ? '—' : `${checkIn} ${getMonthShort()}`}
              </Text>
            </View>
          </View>

          <View style={styles.dateArrow}>
            <Ionicons name="arrow-forward" size={13} color={RealixColors.textMuted} />
          </View>

          <View style={[styles.datePill, checkOut !== null && styles.datePillActive]}>
            <View style={styles.datePillIcon}>
              <Ionicons name="log-out-outline" size={13} color={checkOut !== null ? RealixColors.accent : RealixColors.textMuted} />
            </View>
            <View>
              <Text style={styles.datePillLabel}>Check Out</Text>
              <Text style={[styles.datePillValue, checkOut === null && styles.datePillPlaceholder]}>
                {checkOut === null ? '—' : `${checkOut} ${getMonthShort()}`}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Guest Selector ── */}
        <View style={styles.guestCard}>
          <View style={styles.guestLeft}>
            <View style={styles.guestIconWrap}>
              <Ionicons name="people-outline" size={15} color={RealixColors.accent} />
            </View>
            <View>
              <Text style={styles.guestTitle}>Guests</Text>
              <Text style={styles.guestSub}>Max {maxGuestCount} allowed</Text>
            </View>
          </View>
          <View style={styles.stepper}>
            <Pressable
              style={[styles.stepBtn, guestCount <= 1 && styles.stepBtnDisabled]}
              disabled={guestCount <= 1}
              onPress={() => setGuestCount(v => Math.max(1, v - 1))}
            >
              <Ionicons name="remove" size={14} color={guestCount <= 1 ? RealixColors.textCaption : RealixColors.textPrimary} />
            </Pressable>
            <Text style={styles.stepCount}>{guestCount}</Text>
            <Pressable
              style={[styles.stepBtn, guestCount >= maxGuestCount && styles.stepBtnDisabled]}
              disabled={guestCount >= maxGuestCount}
              onPress={() => setGuestCount(v => Math.min(maxGuestCount, v + 1))}
            >
              <Ionicons name="add" size={14} color={guestCount >= maxGuestCount ? RealixColors.textCaption : RealixColors.accent} />
            </Pressable>
          </View>
        </View>

        {/* ── Calendar ── */}
        <View style={styles.calendarCard}>
          {/* Month nav */}
          <View style={styles.calNav}>
            <Pressable style={styles.navBtn}>
              <Ionicons name="chevron-back" size={14} color={RealixColors.textMuted} />
            </Pressable>
            <View style={styles.calNavCenter}>
              <Text style={styles.calMonthTitle}>{getMonthYear()}</Text>
              {isSelectionComplete && (
                <Badge label={`${nights} night${nights !== 1 ? 's' : ''}`} />
              )}
            </View>
            <Pressable style={styles.navBtn}>
              <Ionicons name="chevron-forward" size={14} color={RealixColors.textMuted} />
            </Pressable>
          </View>

          {/* Weekday labels */}
          <View style={styles.weekRow}>
            {weekdayLabels.map(l => (
              <Text key={l} style={styles.weekLabel}>{l}</Text>
            ))}
          </View>

          {/* Day grid */}
          <View style={styles.daysGrid}>
            {dayCells.map((cell, idx) => {
              const isCurrent = cell.month === 'current';
              const isStart = isCurrent && checkIn === cell.day;
              const isEnd = isCurrent && checkOut === cell.day;
              const isIn = isCurrent && inRange(cell.day);
              const rangeEdgeStart = isRangeStart(cell.day) && isCurrent;
              const rangeEdgeEnd = isRangeEnd(cell.day) && isCurrent;

              return (
                <Pressable
                  key={`${cell.month}-${cell.day}-${idx}`}
                  disabled={!isCurrent}
                  style={[
                    styles.dayCell,
                    isIn && styles.dayCellRange,
                    rangeEdgeStart && styles.dayCellRangeStartEdge,
                    rangeEdgeEnd && styles.dayCellRangeEndEdge,
                    (isStart || isEnd) && styles.dayCellSelected,
                  ]}
                  onPress={() => onSelectDay(cell.day)}
                >
                  <Text style={[
                    styles.dayText,
                    !isCurrent && styles.dayTextOther,
                    (isStart || isEnd) && styles.dayTextSelected,
                    isIn && styles.dayTextInRange,
                  ]}>
                    {cell.day}
                  </Text>
                  {isCurrent && (isStart || isEnd) && (
                    <View style={styles.dayDot} />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Legend */}
          <View style={styles.calLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: RealixColors.accent }]} />
              <Text style={styles.legendText}>Selected</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#2a2a2a', borderWidth: 1, borderColor: '#3a3a3a' }]} />
              <Text style={styles.legendText}>In Range</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: 'transparent', borderWidth: 1, borderColor: RealixColors.textCaption }]} />
              <Text style={styles.legendText}>Unavailable</Text>
            </View>
          </View>
        </View>

        {/* ── Booking Summary (visible after selection) ── */}
        {isSelectionComplete && (
          <View style={styles.summaryCard}>
            {/* Hotel info row */}
            <View style={styles.summaryTop}>
              <View style={styles.summaryThumb}>
                <Ionicons name="business-outline" size={18} color={RealixColors.accent} />
              </View>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryName} numberOfLines={1}>{hotelName || 'Hotel'}</Text>
                <Text style={styles.summaryType}>{roomType || 'Standard Room'}</Text>
                <View style={styles.summaryMeta}>
                  <Ionicons name="calendar-outline" size={10} color={RealixColors.textMuted} />
                  <Text style={styles.summaryMetaText}>{checkIn} – {checkOut} {getMonthShort()}</Text>
                  <View style={styles.metaDivider} />
                  <Ionicons name="people-outline" size={10} color={RealixColors.textMuted} />
                  <Text style={styles.summaryMetaText}>{guestCount} guest{guestCount !== 1 ? 's' : ''}</Text>
                </View>
              </View>
              <View style={styles.summaryPriceTag}>
                <Text style={styles.summaryPriceTagValue}>${actualPrice}</Text>
                <Text style={styles.summaryPriceTagLabel}>/night</Text>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Pricing breakdown */}
            <SectionHeader label="Price Breakdown" />
            <View style={styles.priceBreakdown}>
              <View style={styles.priceRow}>
                <Text style={styles.priceRowLabel}>Room fee <Text style={styles.priceRowNote}>({nights} night{nights !== 1 ? 's' : ''})</Text></Text>
                <Text style={styles.priceRowValue}>${roomFee.toFixed(2)}</Text>
              </View>
              <View style={styles.priceRow}>
                <View style={styles.priceRowLabelRow}>
                  <Text style={styles.priceRowLabel}>Discount</Text>
                  <View style={styles.discountBadge}><Text style={styles.discountBadgeText}>15% OFF</Text></View>
                </View>
                <Text style={[styles.priceRowValue, styles.priceDiscount]}>−${discount.toFixed(2)}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceRowLabel}>VAT <Text style={styles.priceRowNote}>(13%)</Text></Text>
                <Text style={styles.priceRowValue}>${tax.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.totalCard}>
              <Text style={styles.totalCardLabel}>Total Amount</Text>
              <Text style={styles.totalCardValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        )}

        {/* Instruction hint when no dates selected */}
        {!isSelectionComplete && (
          <View style={styles.hintCard}>
            <Ionicons name="information-circle-outline" size={16} color={RealixColors.accent} />
            <Text style={styles.hintText}>
              Tap a start date, then an end date on the calendar above to see pricing.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* ── Bottom Bar ── */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>{isSelectionComplete ? 'Total' : 'From'}</Text>
          <View style={styles.bottomPriceRow}>
            <Text style={styles.bottomPrice}>
              {isSelectionComplete ? `$${total.toFixed(2)}` : `$${actualPrice}`}
            </Text>
            {!isSelectionComplete && (
              <Text style={styles.bottomUnit}>/night</Text>
            )}
          </View>
        </View>
        <Pressable
          style={[styles.confirmBtn, !isSelectionComplete && styles.confirmBtnDisabled]}
          disabled={!isSelectionComplete}
          onPress={handleContinueToPayment}
        >
          <Text style={[styles.confirmBtnText, !isSelectionComplete && styles.confirmBtnTextDisabled]}>
            Confirm & Pay
          </Text>
          <Ionicons
            name="arrow-forward"
            size={14}
            color={isSelectionComplete ? '#000' : RealixColors.textMuted}
          />
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
  headerTitle: { fontSize: 16, fontWeight: '800', color: RealixColors.textPrimary, letterSpacing: -0.3 },
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

  // ── Scroll content ──
  content: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 24, gap: 12 },

  // ── Date row ──
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  datePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: RealixColors.cardBackground,
    borderWidth: 1,
    borderColor: RealixColors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  datePillActive: {
    borderColor: `${RealixColors.accent}88`,
    backgroundColor: `${RealixColors.accent}0d`,
  },
  datePillIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: RealixColors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePillLabel: { fontSize: 9, color: RealixColors.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  datePillValue: { fontSize: 13, fontWeight: '700', color: RealixColors.textPrimary, marginTop: 1 },
  datePillPlaceholder: { color: RealixColors.textCaption, fontWeight: '400' },
  dateArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: RealixColors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Guest card ──
  guestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: RealixColors.cardBackground,
    borderWidth: 1,
    borderColor: RealixColors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  guestLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  guestIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: `${RealixColors.accent}18`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestTitle: { fontSize: 13, fontWeight: '700', color: RealixColors.textPrimary },
  guestSub: { fontSize: 10, color: RealixColors.textMuted, marginTop: 1 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: RealixColors.border,
    backgroundColor: RealixColors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: { opacity: 0.35 },
  stepCount: {
    width: 22,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '800',
    color: RealixColors.textPrimary,
  },

  // ── Calendar ──
  calendarCard: {
    backgroundColor: RealixColors.cardBackground,
    borderWidth: 1,
    borderColor: RealixColors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
  },
  calNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calNavCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  calMonthTitle: { fontSize: 14, fontWeight: '800', color: RealixColors.textPrimary, letterSpacing: -0.2 },
  navBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: RealixColors.inputBackground,
    borderWidth: 1,
    borderColor: RealixColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekRow: { flexDirection: 'row', marginBottom: 6 },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '700',
    color: RealixColors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  dayCellRange: {
    backgroundColor: `${RealixColors.accent}15`,
    borderRadius: 0,
  },
  dayCellRangeStartEdge: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  dayCellRangeEndEdge: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  dayCellSelected: {
    backgroundColor: RealixColors.accent,
    borderRadius: 8,
  },
  dayText: { fontSize: 12, fontWeight: '500', color: RealixColors.textPrimary },
  dayTextOther: { color: RealixColors.textCaption, fontWeight: '400' },
  dayTextSelected: { color: '#000', fontWeight: '800' },
  dayTextInRange: { color: RealixColors.accent },
  dayDot: {
    position: 'absolute',
    bottom: 4,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#000',
  },
  calLegend: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: RealixColors.border,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 2 },
  legendText: { fontSize: 9, color: RealixColors.textMuted, fontWeight: '500' },

  // ── Summary Card ──
  summaryCard: {
    backgroundColor: RealixColors.cardBackground,
    borderWidth: 1,
    borderColor: RealixColors.border,
    borderRadius: 14,
    overflow: 'hidden',
    padding: 14,
    gap: 12,
  },
  summaryTop: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  summaryThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: `${RealixColors.accent}18`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${RealixColors.accent}33`,
  },
  summaryInfo: { flex: 1 },
  summaryName: { fontSize: 13, fontWeight: '800', color: RealixColors.textPrimary, letterSpacing: -0.2 },
  summaryType: { fontSize: 10, color: RealixColors.accent, fontWeight: '600', marginTop: 2 },
  summaryMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  summaryMetaText: { fontSize: 10, color: RealixColors.textMuted },
  metaDivider: { width: 1, height: 10, backgroundColor: RealixColors.border, marginHorizontal: 2 },
  summaryPriceTag: { alignItems: 'flex-end' },
  summaryPriceTagValue: { fontSize: 16, fontWeight: '800', color: RealixColors.textPrimary },
  summaryPriceTagLabel: { fontSize: 9, color: RealixColors.textMuted, marginTop: 1 },

  divider: { height: 1, backgroundColor: RealixColors.border },

  // ── Price Breakdown ──
  priceBreakdown: { gap: 6 },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceRowLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  priceRowLabel: { fontSize: 12, color: RealixColors.textSecondary },
  priceRowNote: { fontSize: 10, color: RealixColors.textMuted },
  priceRowValue: { fontSize: 12, fontWeight: '600', color: RealixColors.textPrimary },
  priceDiscount: { color: '#e05252' },
  discountBadge: {
    backgroundColor: '#e0525215',
    borderWidth: 1,
    borderColor: '#e0525233',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  discountBadgeText: { fontSize: 8, color: '#e05252', fontWeight: '700', letterSpacing: 0.3 },

  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: `${RealixColors.accent}10`,
    borderWidth: 1,
    borderColor: `${RealixColors.accent}33`,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  totalCardLabel: { fontSize: 13, fontWeight: '700', color: RealixColors.textPrimary },
  totalCardValue: { fontSize: 18, fontWeight: '800', color: RealixColors.accent },

  // ── Payment ──
  paymentToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: RealixColors.inputBackground,
    borderWidth: 1,
    borderColor: RealixColors.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  paymentToggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  paymentToggleText: { fontSize: 12, color: RealixColors.textSecondary },
  paymentList: { gap: 8, marginTop: 2 },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: RealixColors.inputBackground,
    borderWidth: 1,
    borderColor: RealixColors.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  paymentItemActive: {
    borderColor: `${RealixColors.accent}88`,
    backgroundColor: `${RealixColors.accent}10`,
  },
  paymentItemIcon: { fontSize: 22 },
  paymentItemLabel: { flex: 1, fontSize: 13, fontWeight: '600', color: RealixColors.textPrimary },
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
  termsText: {
    fontSize: 10,
    lineHeight: 15,
    color: RealixColors.textMuted,
    marginTop: 4,
  },

  // ── Hint ──
  hintCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: `${RealixColors.accent}0d`,
    borderWidth: 1,
    borderColor: `${RealixColors.accent}33`,
    borderRadius: 10,
    padding: 12,
  },
  hintText: { flex: 1, fontSize: 11, color: RealixColors.textSecondary, lineHeight: 16 },

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
  bottomLabel: { fontSize: 10, color: RealixColors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '600' },
  bottomPriceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2, marginTop: 2 },
  bottomPrice: { fontSize: 20, fontWeight: '800', color: RealixColors.textPrimary, letterSpacing: -0.5 },
  bottomUnit: { fontSize: 11, color: RealixColors.textMuted },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: RealixColors.accent,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  confirmBtnDisabled: {
    backgroundColor: RealixColors.inputBackground,
    borderWidth: 1,
    borderColor: RealixColors.border,
  },
  confirmBtnText: { color: '#000', fontSize: 13, fontWeight: '800', letterSpacing: 0.2 },
  confirmBtnTextDisabled: { color: RealixColors.textMuted },
});