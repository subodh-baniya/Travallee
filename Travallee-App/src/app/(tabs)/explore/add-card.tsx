import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealixColors } from '@/src/constants/screens/realix';
import { useSafeNavigation } from '@/src/hooks/useSafeNavigation';

export default function AddCardScreen() {
  const { goBack } = useSafeNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={goBack}><Ionicons name="chevron-back" size={18} color={RealixColors.textSecondary} /></Pressable>
          <Text style={styles.title}>Add Credit Card</Text>
        </View>
      </View>

      <View style={styles.cardDisplay}>
        <View style={styles.cardChip} />
        <Text style={styles.cardNumber}>•••• •••• •••• 4242</Text>
        <View style={styles.cardBottom}>
          <View>
            <Text style={styles.cardLabel}>CARD HOLDER</Text>
            <Text style={styles.cardValue}>Your Name</Text>
          </View>
          <View>
            <Text style={styles.cardLabel}>EXPIRES</Text>
            <Text style={styles.cardValue}>MM/YY</Text>
          </View>
        </View>
      </View>

      <View style={styles.form}>
        {['Card Number', 'Card Holder Name', 'Expiry Date', 'CVV'].map((item, index) => (
          <View key={item} style={index > 1 ? styles.halfFieldWrap : undefined}>
            <Text style={styles.fieldLabel}>{item}</Text>
            <View style={styles.field}><Text style={styles.fieldText}>{index === 0 ? '1234 - 5678 - 9012 - ...' : index === 1 ? 'Your name here' : index === 2 ? 'MM / YY' : '•••'}</Text></View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.button} onPress={goBack}><Text style={styles.buttonText}>Add Card</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RealixColors.screenBackground },
  header: { paddingHorizontal: 20, paddingVertical: 8 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 20, fontWeight: '700', color: RealixColors.textPrimary },
  cardDisplay: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 14,
    padding: 18,
    backgroundColor: '#0d2137',
    borderWidth: 1,
    borderColor: '#1e4a7a',
  },
  cardChip: { width: 28, height: 20, borderRadius: 4, backgroundColor: '#d4af37', marginBottom: 12 },
  cardNumber: { color: 'rgba(255,255,255,0.92)', fontSize: 14, letterSpacing: 2, fontWeight: '600', marginBottom: 14 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { fontSize: 10, color: 'rgba(255,255,255,0.45)', marginBottom: 2 },
  cardValue: { fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  form: { paddingHorizontal: 20, paddingTop: 14, gap: 10 },
  halfFieldWrap: {},
  fieldLabel: { fontSize: 11, color: RealixColors.textMuted, marginBottom: 4 },
  field: { minHeight: 42, borderRadius: 10, backgroundColor: RealixColors.inputBackground, borderWidth: 1, borderColor: RealixColors.inputBorder, justifyContent: 'center', paddingHorizontal: 12 },
  fieldText: { color: RealixColors.textSecondary, fontSize: 13 },
  footer: { marginTop: 'auto', paddingHorizontal: 20, paddingVertical: 14 },
  button: { minHeight: 44, borderRadius: 22, backgroundColor: RealixColors.accent, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#000000', fontWeight: '700', fontSize: 14 },
});