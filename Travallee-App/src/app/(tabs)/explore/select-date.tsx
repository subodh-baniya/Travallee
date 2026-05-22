import React, { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { isAxiosError } from 'axios';
import {
  RealixColors,
  realixDiscoverProperty,
  realixPaymentMethods,
} from '@/src/constants/screens/realix';
import { API_ENDPOINTS_BOOKING } from '@/src/constants/api';
import apiClient from '@/src/services/apiClient';

type DayCell = { day: number; month: 'prev' | 'current' | 'next' };

interface BookingRequestPayload {
  roomId: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  paymentMethod: 'KHALTI' | 'ESEWA' | 'COD';
}

interface BookingRecord {
  _id: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const weekdayLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;
const daysInMonth = 31;
const firstWeekdayOffset = 1;

export default function SelectDateScreen() {
  const router = useRouter();

  // Safe navigation handler
  const handleGoBack = () => {
    try {
      if (router.canGoBack?.()) {
        router.back();
      } else {
        router.replace('/(tabs)/explore');
      }
    } catch (error) {
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
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('esewa');

  const dayCells = useMemo<DayCell[]>(() => {
    const previousMonthDays = Array.from({ length: firstWeekdayOffset }, (_, index) => ({
      day: 31 - firstWeekdayOffset + index + 1,
      month: 'prev' as const,
    }));
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, index) => ({
      day: index + 1,
      month: 'current' as const,
    }));
    const nextMonthDaysCount = 42 - (previousMonthDays.length + currentMonthDays.length);
    const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, index) => ({
      day: index + 1,
      month: 'next' as const,
    }));
    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
  }, []);

  const inRange = (day: number) => checkIn !== null && checkOut !== null && day > checkIn && day < checkOut;

  // Get current month and year for display
  const getCurrentMonthYear = () => {
    const today = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
  };

  // Get current month name for display
  const getCurrentMonthName = () => {
    const today = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[today.getMonth()];
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

  // Format date to YYYY-MM-DD
  const formatBookingDate = (day: number): string => {
    // Get current month and year
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const date = new Date(currentYear, currentMonth, day);
    return date.toISOString().split('T')[0];
  };

  const handleCreateBooking = async () => {
    if (!roomId || !hotelId || !checkIn || !checkOut) {
      Alert.alert('Error', 'Missing required booking information');
      return;
    }

    if (guestCount < 1) {
      Alert.alert('Error', 'Please select at least 1 guest');
      return;
    }

    setIsCreatingBooking(true);
    try {
      const bookingPayload: BookingRequestPayload = {
        roomId,
        hotelId,
        checkIn: formatBookingDate(checkIn),
        checkOut: formatBookingDate(checkOut),
        guestCount,
        paymentMethod: selectedPaymentMethod.toUpperCase() as BookingRequestPayload['paymentMethod'],
      };

      const { data } = await apiClient.post<ApiResponse<BookingRecord>>(
        API_ENDPOINTS_BOOKING.CREATE_BOOKING,
        bookingPayload,
      );

      if (data.success && data.data?._id) {
        Alert.alert('Success', 'Booking created successfully!', [
          {
            text: 'OK',
            onPress: () => {
              router.push({
                pathname: '/(tabs)/explore/payment',
                params: {
                  bookingId: data.data._id,
                  checkIn: String(checkIn),
                  checkOut: String(checkOut),
                  guests: String(guestCount),
                  roomType,
                  pricePerNight,
                },
              });
            },
          },
        ]);
        return;
      }

      Alert.alert('Booking Error', data.message || 'Failed to create booking');
    } catch (error) {
      const errorMsg = isAxiosError(error)
        ? error.response?.data?.message || error.message || 'Failed to create booking'
        : 'Failed to create booking';
      Alert.alert('Booking Error', errorMsg);
    } finally {
      setIsCreatingBooking(false);
    }
  };

  // Calculate pricing
  const nights = isSelectionComplete ? checkOut - checkIn : 0;
  const nightlyPrice = actualPrice;
  const roomFee = nights * nightlyPrice;
  const discountPercentage = 0.15; // 15% discount
  const discount = roomFee * discountPercentage;
  const taxRate = 0.13; // 13% tax rate
  const tax = (roomFee - discount) * taxRate;
  const total = roomFee - discount + tax;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.headerIcon} onPress={handleGoBack}>
            <Ionicons name="chevron-back" size={18} color={RealixColors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Select Date</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.headerIcon}><Ionicons name="heart-outline" size={16} color={RealixColors.textSecondary} /></Pressable>
          <Pressable style={styles.headerIcon}><Ionicons name="ellipsis-horizontal" size={16} color={RealixColors.textSecondary} /></Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.dateInputRow}>
          <View style={[styles.dateInput, checkIn !== null && styles.dateInputActive]}>
            <Text style={styles.dateLabel}>Check In</Text>
            <Text style={[styles.dateValue, checkIn === null && styles.placeholder]}>
              {checkIn === null ? 'Check In' : `${checkIn} ${getCurrentMonthName()}`}
            </Text>
          </View>
          <View style={[styles.dateInput, checkOut !== null && styles.dateInputActive]}>
            <Text style={styles.dateLabel}>Check Out</Text>
            <Text style={[styles.dateValue, checkOut === null && styles.placeholder]}>
              {checkOut === null ? 'Check Out' : `${checkOut} ${getCurrentMonthName()}`}
            </Text>
          </View>
        </View>

        <View style={styles.guestRow}>
          <Ionicons name="person-outline" size={14} color={RealixColors.textMuted} />
          <Text style={styles.guestLabel}>Guest</Text>
          <View style={styles.guestStepper}>
            <Pressable style={styles.stepperBtn} onPress={() => setGuestCount((value) => Math.max(1, value - 1))}>
              <Ionicons name="remove" size={14} color={RealixColors.textPrimary} />
            </Pressable>
            <Text style={styles.guestCount}>{guestCount}</Text>
            <Pressable
              style={[styles.stepperBtn, guestCount >= maxGuestCount && styles.stepperBtnDisabled]}
              disabled={guestCount >= maxGuestCount}
              onPress={() => setGuestCount((value) => Math.min(maxGuestCount, value + 1))}
            >
              <Ionicons name="add" size={14} color={guestCount >= maxGuestCount ? RealixColors.textMuted : RealixColors.textPrimary} />
            </Pressable>
          </View>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.calendarNav}>
            <Pressable><Text style={styles.navArrow}>‹</Text></Pressable>
            <Text style={styles.monthTitle}>{getCurrentMonthYear()}</Text>
            <Pressable><Text style={styles.navArrow}>›</Text></Pressable>
          </View>

          <View style={styles.weekRow}>
            {weekdayLabels.map((label) => (
              <Text key={label} style={styles.weekLabel}>{label}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {dayCells.map((cell, index) => {
              const isCurrent = cell.month === 'current';
              const isStart = isCurrent && checkIn === cell.day;
              const isEnd = isCurrent && checkOut === cell.day;
              const isInRange = isCurrent && inRange(cell.day);
              return (
                <Pressable
                  key={`${cell.month}-${cell.day}-${index}`}
                  disabled={!isCurrent}
                  style={[
                    styles.dayCell,
                    isInRange && styles.dayRange,
                    (isStart || isEnd) && styles.daySelected,
                  ]}
                  onPress={() => onSelectDay(cell.day)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      !isCurrent && styles.dayOther,
                      (isStart || isEnd) && styles.dayTextSelected,
                    ]}
                  >
                    {cell.day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {isSelectionComplete ? (
          <View style={styles.bookingPanel}>
            <View style={styles.bookingTop}>
              <View style={styles.bookingThumb} />
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingName}>{hotelName || 'Hotel'}</Text>
                <Text style={styles.bookingSubtitle}>{roomType || 'Room'}</Text>
                <Text style={styles.bookingDate}>{checkIn} - {checkOut} {getCurrentMonthName()} | {guestCount} guest{guestCount !== 1 ? 's' : ''}</Text>
                <Text style={styles.bookingPrice}>${nightlyPrice}/night</Text>
              </View>
            </View>

            <Text style={styles.detailTitle}>Detail</Text>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Room Fee ({nights} night{nights !== 1 ? 's' : ''})</Text><Text style={styles.detailValue}>${roomFee}</Text></View>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Discount (15%)</Text><Text style={[styles.detailValue, styles.discount]}>-${discount.toFixed(2)}</Text></View>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Tax (10%)</Text><Text style={styles.detailValue}>${tax.toFixed(2)}</Text></View>
            <View style={[styles.detailRow, styles.totalRow]}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>${total.toFixed(2)}</Text></View>

            <Text style={styles.payTitle}>Select Payment</Text>
            <Pressable style={styles.paymentHeader} onPress={() => setShowPaymentMethods((value) => !value)}>
              <Text style={styles.paymentHeaderText}>Payment Method</Text>
              <Ionicons name={showPaymentMethods ? 'chevron-up' : 'chevron-down'} size={14} color={RealixColors.textMuted} />
            </Pressable>

            {showPaymentMethods ? (
              <View style={styles.paymentOptionsWrap}>
                {realixPaymentMethods.map((method) => (
                  <Pressable
                    key={method.id}
                    style={[styles.paymentOptionItem, selectedPaymentMethod === method.id && styles.paymentOptionSelected]}
                    onPress={() => setSelectedPaymentMethod(method.id)}
                  >
                    <Text style={styles.paymentMethodIcon}>
                      {method.icon}
                    </Text>
                    <View style={styles.paymentMethodInfo}>
                      <Text style={styles.paymentMethodLabel}>{method.label}</Text>
                    </View>
                    <View style={styles.radioButton}>
                      {selectedPaymentMethod === method.id && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                  </Pressable>
                ))}
                <Text style={styles.termsText}>
                  By selecting pay it from below you agree to the House Rules, Cancellation Regulations, Privacy and Policy, and accept extra hotel terms.
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Price:</Text>
          <Text style={styles.priceValue}>{isSelectionComplete ? `$${total.toFixed(2)}` : `$${nightlyPrice}`}<Text style={styles.priceUnit}>{isSelectionComplete ? ' total' : '/night'}</Text></Text>
        </View>
        <Pressable
          style={[styles.confirmButton, !isSelectionComplete && styles.confirmDisabled]}
          disabled={!isSelectionComplete || isCreatingBooking}
          onPress={handleCreateBooking}
        >
          {isCreatingBooking ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.confirmText}>Confirm</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RealixColors.pageBackground },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: RealixColors.textPrimary },
  headerRight: { flexDirection: 'row', gap: 8 },
  headerIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: RealixColors.border,
    backgroundColor: RealixColors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingHorizontal: 20, paddingBottom: 20, gap: 12 },
  dateInputRow: { flexDirection: 'row', gap: 8 },
  dateInput: {
    flex: 1,
    backgroundColor: RealixColors.inputBackground,
    borderWidth: 1,
    borderColor: RealixColors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dateInputActive: { borderColor: RealixColors.textPrimary },
  dateLabel: { fontSize: 10, color: RealixColors.textMuted },
  dateValue: { marginTop: 2, fontSize: 12, color: RealixColors.textPrimary, fontWeight: '600' },
  placeholder: { color: RealixColors.textCaption, fontWeight: '400' },
  guestRow: {
    backgroundColor: RealixColors.cardBackground,
    borderWidth: 1,
    borderColor: RealixColors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guestLabel: { fontSize: 12, color: RealixColors.textMuted, flex: 1 },
  guestStepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepperBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: RealixColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    opacity: 0.5,
  },
  guestCount: { width: 18, textAlign: 'center', fontSize: 12, color: RealixColors.textPrimary, fontWeight: '600' },
  calendarCard: {
    backgroundColor: RealixColors.screenBackground,
    borderWidth: 1,
    borderColor: RealixColors.border,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 8,
  },
  calendarNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  navArrow: { fontSize: 16, color: RealixColors.textMuted, paddingHorizontal: 4 },
  monthTitle: { fontSize: 13, fontWeight: '700', color: RealixColors.textPrimary },
  weekRow: { flexDirection: 'row', marginBottom: 4 },
  weekLabel: { flex: 1, textAlign: 'center', fontSize: 10, color: RealixColors.textMuted, fontWeight: '600' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  dayText: { fontSize: 11, color: RealixColors.textPrimary },
  dayOther: { color: RealixColors.textCaption },
  dayRange: { backgroundColor: '#2a2a2a', borderRadius: 0 },
  daySelected: { backgroundColor: RealixColors.textPrimary, borderRadius: 18 },
  dayTextSelected: { color: RealixColors.screenBackground, fontWeight: '700' },
  bookingPanel: {
    backgroundColor: RealixColors.cardBackground,
    borderWidth: 1,
    borderColor: RealixColors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookingTop: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: RealixColors.border,
  },
  bookingThumb: {
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: '#1a2a3a',
  },
  bookingInfo: { flex: 1, justifyContent: 'center' },
  bookingName: { fontSize: 12, fontWeight: '700', color: RealixColors.textPrimary },
  bookingDate: { fontSize: 10, color: RealixColors.textMuted, marginTop: 2 },
  bookingSubtitle: { fontSize: 10, color: RealixColors.accent, marginTop: 1 },
  bookingPrice: { fontSize: 11, fontWeight: '700', color: RealixColors.textPrimary, marginTop: 2 },
  detailTitle: { paddingHorizontal: 12, paddingTop: 10, fontSize: 12, fontWeight: '700', color: RealixColors.textPrimary },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  detailLabel: { fontSize: 12, color: RealixColors.textSecondary },
  detailValue: { fontSize: 12, color: RealixColors.textSecondary },
  discount: { color: '#e74c3c' },
  totalRow: { borderTopWidth: 1, borderTopColor: RealixColors.border, marginTop: 2, paddingTop: 8, paddingBottom: 8 },
  totalLabel: { fontSize: 12, fontWeight: '700', color: RealixColors.textPrimary },
  totalValue: { fontSize: 12, fontWeight: '700', color: RealixColors.textPrimary },
  payTitle: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 6, fontSize: 12, fontWeight: '700', color: RealixColors.textPrimary },
  paymentHeader: {
    marginHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: RealixColors.inputBorder,
    borderRadius: 8,
    minHeight: 36,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentHeaderText: { fontSize: 12, color: RealixColors.textSecondary },
  paymentOptionsWrap: { paddingHorizontal: 12, paddingBottom: 10, gap: 8 },
  paymentOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: RealixColors.inputBackground,
    borderWidth: 1,
    borderColor: RealixColors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  paymentOptionSelected: {
    borderColor: RealixColors.accent,
    backgroundColor: `${RealixColors.accent}15`,
  },
  paymentMethodIcon: {
    fontSize: 24,
  },
  paymentMethodEmoji: {
    fontSize: 20,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: RealixColors.textPrimary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: RealixColors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: RealixColors.accent,
  },
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mcIcon: {
    width: 30,
    height: 18,
    borderRadius: 3,
    backgroundColor: '#eb001b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mcText: { color: '#ffffff', fontSize: 8, fontWeight: '700' },
  ppIcon: {
    width: 30,
    height: 18,
    borderRadius: 3,
    backgroundColor: '#003087',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ppText: { color: '#009cde', fontSize: 8, fontWeight: '700' },
  payMethodText: { fontSize: 12, color: RealixColors.textPrimary },
  addPaymentRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addPaymentText: { fontSize: 12, color: RealixColors.textMuted },
  termsText: { fontSize: 10, lineHeight: 15, color: RealixColors.textMuted },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: RealixColors.border,
    backgroundColor: RealixColors.screenBackground,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: { fontSize: 11, color: RealixColors.textMuted },
  priceValue: { fontSize: 18, color: RealixColors.textPrimary, fontWeight: '700' },
  priceUnit: { fontSize: 12, color: RealixColors.textMuted, fontWeight: '400' },
  confirmButton: {
    backgroundColor: RealixColors.accent,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  confirmDisabled: { backgroundColor: '#3a3a3a' },
  confirmText: { color: '#000000', fontSize: 13, fontWeight: '700' },
});