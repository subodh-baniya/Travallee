import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RealixHeader, RealixScreen, RealixCard } from '@/src/components/realix/screen-shell';
import { RealixColors } from '@/src/constants/screens/realix';
import { useAuth } from '@/src/context/AuthContext';
import apiClient from '@/src/services/apiClient';
import { API_ENDPOINTS_BOOKING } from '@/src/constants/api';

interface InAppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  icon: string;
  type: 'status' | 'reminder';
  read: boolean;
  link?: string;
}

export default function ProfileNotificationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const loadNotifications = async () => {
      try {
        setLoading(true);
        
        // Load read/dismissed statuses from storage
        const readListRaw = await AsyncStorage.getItem(`@notif_read_${user.id}`);
        const dismissedListRaw = await AsyncStorage.getItem(`@notif_dismissed_${user.id}`);
        
        const readIds: string[] = readListRaw ? JSON.parse(readListRaw) : [];
        const dismissedIds: string[] = dismissedListRaw ? JSON.parse(dismissedListRaw) : [];

        // Fetch bookings
        const url = `${API_ENDPOINTS_BOOKING.GET_BOOKINGS}/booking-history/${user.id}`;
        const response = await apiClient.get(url);
        
        if (response.data?.success) {
          const bookings = response.data?.data?.bookings || [];
          const generatedNotifs: InAppNotification[] = [];

          bookings.forEach((b: any) => {
            const checkInDate = new Date(b.checkIn);
            const checkOutDate = new Date(b.checkOut);
            const now = new Date();

            // 1. Booking Status Notification
            const statusId = `status_${b.bookingId}`;
            if (!dismissedIds.includes(statusId)) {
              let bodyMsg = `Your stay at ${b.hotelName} (Room ${b.roomNumber || '-'}) is currently ${b.status?.toLowerCase() || 'pending'}.`;
              if (b.status === 'CONFIRMED') {
                bodyMsg = `Your stay at ${b.hotelName} is confirmed! Check-in: ${checkInDate.toLocaleDateString()}. Ref: ${b.bookingId.slice(-6).toUpperCase()}.`;
              }
              
              generatedNotifs.push({
                id: statusId,
                title: b.status === 'CONFIRMED' ? 'Booking Confirmed! 🏔️' : 'Booking Pending Approval ⏳',
                body: bodyMsg,
                timestamp: checkInDate.toLocaleDateString(),
                icon: b.status === 'CONFIRMED' ? 'checkmark-circle-outline' : 'time-outline',
                type: 'status',
                read: readIds.includes(statusId),
              });
            }

            // 2. Review Reminder Notification (if stay is completed)
            const reviewId = `review_${b.bookingId}`;
            if (checkOutDate < now && !dismissedIds.includes(reviewId)) {
              generatedNotifs.push({
                id: reviewId,
                title: 'Review your stay! ⭐',
                body: `We hope you enjoyed your stay at ${b.hotelName}. Tap here to share your review and rate your experience.`,
                timestamp: checkOutDate.toLocaleDateString(),
                icon: 'star-outline',
                type: 'reminder',
                read: readIds.includes(reviewId),
                link: '/(tabs)/profile/review',
              });
            }
          });

          // Sort by timestamp
          setNotifications(generatedNotifs);
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [user?.id]);

  const markAsRead = async (id: string) => {
    if (!user?.id) return;
    try {
      const readListRaw = await AsyncStorage.getItem(`@notif_read_${user.id}`);
      const readIds: string[] = readListRaw ? JSON.parse(readListRaw) : [];
      
      if (!readIds.includes(id)) {
        const nextIds = [...readIds, id];
        await AsyncStorage.setItem(`@notif_read_${user.id}`, JSON.stringify(nextIds));
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id: string) => {
    if (!user?.id) return;
    try {
      const dismissedListRaw = await AsyncStorage.getItem(`@notif_dismissed_${user.id}`);
      const dismissedIds: string[] = dismissedListRaw ? JSON.parse(dismissedListRaw) : [];
      
      if (!dismissedIds.includes(id)) {
        const nextIds = [...dismissedIds, id];
        await AsyncStorage.setItem(`@notif_dismissed_${user.id}`, JSON.stringify(nextIds));
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationPress = (notif: InAppNotification) => {
    markAsRead(notif.id);
    if (notif.link) {
      router.push(notif.link as any);
    }
  };

  return (
    <RealixScreen contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <RealixHeader title="Notifications" showBack />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={RealixColors.accent} />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={60} color={RealixColors.textMuted} />
          <Text style={styles.emptyTitle}>All caught up!</Text>
          <Text style={styles.emptySubtitle}>No new notifications. Updates about your bookings will appear here.</Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {notifications.map((notif) => (
            <RealixCard 
              key={notif.id} 
              style={[styles.card, !notif.read && styles.unreadCard]}
            >
              <Pressable 
                style={styles.cardContent}
                onPress={() => handleNotificationPress(notif)}
              >
                <View style={styles.iconWrap}>
                  <Ionicons name={notif.icon as any} size={22} color={notif.read ? RealixColors.textSecondary : RealixColors.accent} />
                </View>
                <View style={styles.bodyWrap}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.title, !notif.read && styles.unreadText]}>{notif.title}</Text>
                    <Text style={styles.time}>{notif.timestamp}</Text>
                  </View>
                  <Text style={styles.body}>{notif.body}</Text>
                </View>
              </Pressable>
              <Pressable 
                style={styles.deleteBtn}
                onPress={() => deleteNotification(notif.id)}
              >
                <Ionicons name="trash-outline" size={16} color={RealixColors.textMuted} />
              </Pressable>
            </RealixCard>
          ))}
        </ScrollView>
      )}
    </RealixScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 0, flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80 },
  loadingText: { color: RealixColors.textSecondary, fontSize: 13, marginTop: 10 },
  card: { padding: 14, flexDirection: 'row', gap: 10, alignItems: 'center', marginVertical: 6, position: 'relative' },
  unreadCard: { borderColor: 'rgba(126, 211, 33, 0.35)', borderWidth: 1 },
  cardContent: { flex: 1, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  iconWrap: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#1e1e1e', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: RealixColors.border },
  bodyWrap: { flex: 1, gap: 4 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  title: { fontSize: 13, fontWeight: '600', color: RealixColors.textSecondary },
  unreadText: { color: RealixColors.textPrimary, fontWeight: '700' },
  time: { fontSize: 10, color: RealixColors.textMuted },
  body: { fontSize: 12, color: RealixColors.textMuted, lineHeight: 17, paddingRight: 15 },
  deleteBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: '#1e1e1e', position: 'absolute', bottom: 10, right: 10 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 8, minHeight: 300, paddingTop: 100 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: RealixColors.textPrimary, marginTop: 12 },
  emptySubtitle: { fontSize: 14, color: RealixColors.textSecondary, textAlign: 'center', lineHeight: 20 },
});