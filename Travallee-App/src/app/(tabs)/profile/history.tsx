import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RealixCard, RealixHeader, RealixScreen } from '@/src/components/realix/screen-shell';
import { RealixColors, realixHistoryBookings } from '@/src/constants/screens/realix';

export default function ProfileHistoryScreen() {
  const router = useRouter();

  return (
    <RealixScreen contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <RealixHeader title="History" showBack />

      {realixHistoryBookings.map((booking) => (
        <RealixCard key={booking.id} style={styles.card}>
          <View style={styles.emojiWrap}><Text style={styles.emoji}>{booking.emoji}</Text></View>
          <View style={styles.body}>
            <Text style={styles.name}>{booking.name}</Text>
            <Text style={styles.detail}>{booking.detail}</Text>
            <Text style={styles.dates}>{booking.dates}</Text>
          </View>
          <Pressable style={styles.reviewButton} onPress={() => router.push('/(tabs)/profile/review')}>
            <Ionicons name="star-outline" size={15} color="#000000" />
            <Text style={styles.reviewText}>Review</Text>
          </Pressable>
        </RealixCard>
      ))}
    </RealixScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 0 },
  card: { padding: 16, gap: 12 },
  emojiWrap: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#232323', alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 26 },
  body: { gap: 4 },
  name: { fontSize: 15, fontWeight: '700', color: RealixColors.textPrimary },
  detail: { fontSize: 12, color: RealixColors.textSecondary },
  dates: { fontSize: 11, color: RealixColors.textMuted },
  reviewButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: RealixColors.accent, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 8 },
  reviewText: { fontSize: 12, fontWeight: '700', color: '#000000' },
});