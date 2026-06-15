import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { RealixCard, RealixHeader, RealixScreen } from '@/src/components/realix/screen-shell';
import { RealixColors } from '@/src/constants/screens/realix';
import { useAuth } from '@/src/context/AuthContext';
import apiClient from '@/src/services/apiClient';
import { API_ENDPOINTS_BOOKING } from '@/src/constants/api';

interface UserBooking {
  bookingId: string;
  hotelId: string;
  hotelName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
  const day = date.toLocaleDateString('en-US', { day: 'numeric' });
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.toLocaleDateString('en-US', { year: '2-digit' });
  return `${weekday}, ${day} ${month} ${year}`;
};

const getEmoji = (index: number) => {
  const emojis = ['🏖️', '🌴', '🏨', '🛌', '🏔️', '🏞️'];
  return emojis[index % emojis.length];
};

export default function ProfileHistoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = `${API_ENDPOINTS_BOOKING.GET_BOOKINGS}/booking-history/${user.id}`;
        const response = await apiClient.get(url);
        if (response.data?.success) {
          setBookings(response.data?.data?.bookings || []);
        } else {
          setError('Failed to fetch booking history');
        }
      } catch (err: any) {
        console.error('Error fetching booking history:', err);
        setError(err.message || 'Error loading booking history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user?.id]);

  return (
    <RealixScreen contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <RealixHeader title="History" showBack />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={RealixColors.accent} />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={RealixColors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={60} color={RealixColors.textMuted} />
          <Text style={styles.emptyTitle}>No Bookings Yet</Text>
          <Text style={styles.emptySubtitle}>Your completed and upcoming bookings will appear here.</Text>
        </View>
      ) : (
        bookings.map((booking, index) => (
          <RealixCard key={booking.bookingId || index} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.emojiWrap}>
                <Text style={styles.emoji}>{getEmoji(index)}</Text>
              </View>
              <View style={styles.body}>
                <Text style={styles.name}>{booking.hotelName || 'Hotel stay'}</Text>
                <Text style={styles.detail}>Room {booking.roomNumber || '-'}</Text>
                <Text style={styles.dates}>
                  {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
                </Text>
              </View>
            </View>
            <View style={styles.actionRow}>
              <Pressable
                style={styles.reviewButton}
                onPress={() => router.push('/(tabs)/profile/review')}
              >
                <Ionicons name="star-outline" size={15} color="#000000" />
                <Text style={styles.reviewText}>Review</Text>
              </Pressable>

              <Pressable
                style={styles.chatButton}
                onPress={() => {
                  const roomName = `chat_${booking.hotelId || booking.hotelName}_${user?.id}`;
                  router.push({
                    pathname: '/(tabs)/notifications/chat',
                    params: { thread: roomName, hotelName: booking.hotelName }
                  });
                }}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={15} color="#ffffff" />
                <Text style={styles.chatButtonText}>Chat</Text>
              </Pressable>
            </View>
          </RealixCard>
        ))
      )}
    </RealixScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 0 },
  card: { padding: 16, gap: 12 },
  cardHeader: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  emojiWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#232323',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 26 },
  body: { gap: 4, flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: RealixColors.textPrimary },
  detail: { fontSize: 12, color: RealixColors.textSecondary },
  dates: { fontSize: 11, color: RealixColors.textMuted },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: RealixColors.accent,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  reviewText: { fontSize: 12, fontWeight: '700', color: '#000000' },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2c2c2c',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chatButtonText: { fontSize: 12, fontWeight: '700', color: '#ffffff' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: RealixColors.textSecondary,
    fontSize: 14,
    marginTop: 12,
  },
  errorText: {
    color: RealixColors.danger,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 8,
    minHeight: 300,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: RealixColors.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: RealixColors.textSecondary,
    textAlign: 'center',
  },
});
;