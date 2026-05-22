import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealixColors } from '@/src/constants/screens/realix';
import { useSafeNavigation } from '@/src/hooks/useSafeNavigation';

const numberRows = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', '⌫']] as const;

export default function PasscodeScreen() {
  const router = useRouter();
  const { goBack } = useSafeNavigation();
  const { roomId, hotelId, hotelName, roomType, pricePerNight, checkIn, checkOut, guests, paymentMethod, maxGuests } = useLocalSearchParams<{
    roomId?: string;
    hotelId?: string;
    hotelName?: string;
    roomType?: string;
    pricePerNight?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    paymentMethod?: string;
    maxGuests?: string;
  }>();
  const [digits, setDigits] = useState(['1', '2', '3', '4', '', '']);

  const pushDigit = (digit: string) => {
    if (digit === '⌫') {
      const next = [...digits];
      const index = next.findLastIndex((item) => item !== '');
      if (index >= 0) next[index] = '';
      setDigits(next);
      return;
    }

    if (!digit) return;
    const next = [...digits];
    const index = next.findIndex((item) => item === '');
    if (index >= 0) next[index] = digit;
    setDigits(next);
    if (index === digits.length - 1) {
      router.replace({
        pathname: '/(tabs)/explore/success',
        params: {
          roomId,
          hotelId,
          hotelName,
          roomType,
          pricePerNight,
          checkIn,
          checkOut,
          guests,
          paymentMethod,
          maxGuests,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <View style={styles.header}><Pressable onPress={goBack}><Ionicons name="chevron-back" size={18} color={RealixColors.textSecondary} /></Pressable><Text style={styles.headerTitle}>Passcode</Text></View>
      <View style={styles.body}>
        <Text style={styles.subTitle}>Neighbourhood</Text>
        <View style={styles.dotsRow}>{digits.map((digit, index) => <View key={index} style={[styles.dot, digit && styles.dotFilled]} />)}</View>
        <View style={styles.touchCard}>
          <View style={styles.touchIcon}><Ionicons name="finger-print" size={28} color="#000000" /></View>
          <Text style={styles.touchText}>Continue with Touch ID to proceed the payment</Text>
        </View>
      </View>
      <View style={styles.pad}>
        {numberRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.padRow}>
            {row.map((key) => (
              <Pressable key={key || 'empty'} style={[styles.key, !key && styles.keyEmpty]} disabled={!key} onPress={() => pushDigit(key)}>
                <Text style={styles.keyText}>{key}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RealixColors.screenBackground },
  header: { paddingHorizontal: 20, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: RealixColors.textPrimary },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  subTitle: { fontSize: 12, color: RealixColors.textMuted, marginBottom: 10 },
  dotsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1.5, borderColor: '#444' },
  dotFilled: { backgroundColor: RealixColors.textPrimary, borderColor: RealixColors.textPrimary },
  touchCard: { alignItems: 'center', gap: 10, backgroundColor: RealixColors.cardBackground, borderWidth: 1, borderColor: RealixColors.border, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 18 },
  touchIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: RealixColors.accent, alignItems: 'center', justifyContent: 'center' },
  touchText: { fontSize: 12, lineHeight: 18, color: RealixColors.textSecondary, textAlign: 'center' },
  pad: { paddingHorizontal: 24, paddingBottom: 18, gap: 8 },
  padRow: { flexDirection: 'row', gap: 8 },
  key: { flex: 1, height: 44, borderRadius: 14, backgroundColor: RealixColors.cardBackground, borderWidth: 1, borderColor: RealixColors.border, alignItems: 'center', justifyContent: 'center' },
  keyEmpty: { backgroundColor: 'transparent', borderWidth: 0 },
  keyText: { fontSize: 18, fontWeight: '600', color: RealixColors.textPrimary },
});