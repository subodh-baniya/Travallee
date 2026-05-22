import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealixColors } from '@/src/constants/screens/realix';

export default function ExploreSuccessScreen() {
  const router = useRouter();
  const { hotelName, roomType, checkIn, checkOut, guests } = useLocalSearchParams<{
    hotelName?: string;
    roomType?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>();

  const summary = [hotelName, roomType].filter(Boolean).join(' • ');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.iconWrap}><Ionicons name="checkmark" size={32} color="#000000" /></View>
        <Text style={styles.title}>Payment successful</Text>
        <Text style={styles.body}>Your booking details were saved locally and passed through the flow. Backend actions can plug into this screen later.</Text>
        {summary ? <Text style={styles.summary}>{summary}</Text> : null}
        {checkIn && checkOut && guests ? <Text style={styles.summary}>{checkIn} to {checkOut} • {guests} guest{guests === '1' ? '' : 's'}</Text> : null}
        <Pressable style={styles.button} onPress={() => router.replace('/(tabs)/index')}><Text style={styles.buttonText}>Go To Home</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RealixColors.screenBackground },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, gap: 12 },
  iconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: RealixColors.accent, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: RealixColors.textPrimary, textAlign: 'center' },
  body: { fontSize: 13, lineHeight: 20, color: RealixColors.textMuted, textAlign: 'center' },
  summary: { fontSize: 12, fontWeight: '600', color: RealixColors.textSecondary, textAlign: 'center' },
  button: { marginTop: 8, minHeight: 42, borderRadius: 22, backgroundColor: RealixColors.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  buttonText: { color: '#000000', fontWeight: '700' },
});