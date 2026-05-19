import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  RealixColors,
  realixDiscoverProperty,
  realixPaymentMethods,
} from '@/src/constants/screens/realix';
import { useSafeNavigation } from '@/src/hooks/useSafeNavigation';

export default function PaymentScreen() {
  const { goBack } = useSafeNavigation();
  const { checkIn, checkOut, guests } = useLocalSearchParams<{
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>();
  const [selectedMethod, setSelectedMethod] = useState(realixPaymentMethods[0].id);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.headerIcon} onPress={goBack}>
            <Ionicons name="chevron-back" size={18} color={RealixColors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Payment</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.headerIcon}><Ionicons name="heart-outline" size={16} color={RealixColors.textSecondary} /></Pressable>
          <Pressable style={styles.headerIcon}><Ionicons name="ellipsis-horizontal" size={16} color={RealixColors.textSecondary} /></Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.bookingPanel}>
          <View style={styles.bookingTop}>
            <View style={styles.bookingThumb} />
            <View style={styles.bookingInfo}>
              <Text style={styles.bookingName}>Cassablanca Ground</Text>
              <Text style={styles.bookingDate}>{checkIn ?? '8'} Aug - {checkOut ?? '15'} Aug • {guests ?? '1'} Guest</Text>
              <Text style={styles.bookingPrice}>${realixDiscoverProperty.nightlyPrice}</Text>
            </View>
          </View>
          <Text style={styles.detailTitle}>Detail</Text>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Room Fee</Text><Text style={styles.detailValue}>$150</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Discount</Text><Text style={[styles.detailValue, styles.discount]}>-$38</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Tax 10%</Text><Text style={styles.detailValue}>$34.9</Text></View>
          <View style={[styles.detailRow, styles.totalRow]}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>$146.9</Text></View>
        </View>

        <Text style={styles.payTitle}>Select Payment</Text>
        <View style={styles.payMethodHeader}>
          <Text style={styles.paymentHeaderText}>Payment Method</Text>
          <Ionicons name="chevron-up" size={14} color={RealixColors.textMuted} />
        </View>

        {realixPaymentMethods.map((method) => {
          const isActive = selectedMethod === method.id;
          return (
            <Pressable key={method.id} style={styles.methodRow} onPress={() => setSelectedMethod(method.id)}>
              <View style={[styles.payIcon, method.id === 'paypal' ? styles.paypalIcon : styles.masterIcon]}>
                <Text style={method.id === 'paypal' ? styles.ppText : styles.mcText}>{method.shortCode}</Text>
              </View>
              <Text style={styles.methodLabel}>{method.label}</Text>
              <Ionicons
                name={isActive ? 'radio-button-on' : 'radio-button-off'}
                size={18}
                color={isActive ? RealixColors.accentToggle : RealixColors.textCaption}
              />
            </Pressable>
          );
        })}

        <Pressable style={styles.addPaymentRow} onPress={() => router.push('/(tabs)/explore/add-card')}>
          <Ionicons name="add" size={14} color={RealixColors.textMuted} />
          <Text style={styles.addPaymentText}>Add Payment</Text>
        </Pressable>

        <Text style={styles.termsText}>
          By selecting buy it from below you agree to the House Rules, Cancellation Regulations, Privacy and Policy and accept extra hotel terms.
        </Text>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable
          style={styles.payNowButton}
          onPress={() => router.push('/(tabs)/explore/passcode')}
        >
          <Text style={styles.payNowText}>Pay Now</Text>
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
    backgroundColor: RealixColors.screenBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingHorizontal: 20, paddingBottom: 20, gap: 10 },
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
  payTitle: { fontSize: 12, fontWeight: '700', color: RealixColors.textPrimary, paddingHorizontal: 2 },
  payMethodHeader: {
    borderWidth: 1,
    borderColor: RealixColors.inputBorder,
    borderRadius: 8,
    minHeight: 36,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: RealixColors.cardBackground,
  },
  paymentHeaderText: { fontSize: 12, color: RealixColors.textSecondary },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: RealixColors.cardBackground,
    borderWidth: 1,
    borderColor: RealixColors.border,
    borderRadius: 8,
    minHeight: 40,
    paddingHorizontal: 10,
  },
  payIcon: {
    width: 30,
    height: 18,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  masterIcon: { backgroundColor: '#eb001b' },
  paypalIcon: { backgroundColor: '#003087' },
  mcText: { color: '#ffffff', fontSize: 8, fontWeight: '700' },
  ppText: { color: '#009cde', fontSize: 8, fontWeight: '700' },
  methodLabel: { flex: 1, fontSize: 12, color: RealixColors.textPrimary },
  addPaymentRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addPaymentText: { fontSize: 12, color: RealixColors.textMuted },
  termsText: { fontSize: 10, lineHeight: 16, color: RealixColors.textMuted },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: RealixColors.border,
    backgroundColor: RealixColors.screenBackground,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  payNowButton: {
    minHeight: 42,
    borderRadius: 22,
    backgroundColor: RealixColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payNowText: { color: '#000000', fontWeight: '700', fontSize: 13 },
});