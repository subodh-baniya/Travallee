import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealixColors } from '@/src/constants/screens/realix';
import { useAuth } from '@/src/context/AuthContext';
import apiClient from '@/src/services/apiClient';
import { API_ENDPOINTS_BOOKING } from '@/src/constants/api';

interface ChatThread {
  hotelId: string;
  hotelName: string;
  roomName: string;
}

export default function InboxScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchThreads = async () => {
      try {
        setLoading(true);
        const url = `${API_ENDPOINTS_BOOKING.GET_BOOKINGS}/booking-history/${user.id}`;
        const response = await apiClient.get(url);
        if (response.data?.success) {
          const bookings = response.data?.data?.bookings || [];
          
          // Group by hotelId to get unique hotels
          const uniqueHotels: Record<string, string> = {};
          bookings.forEach((b: any) => {
            if (b.hotelName) {
              const hId = b.hotelId || b.hotelName; // fallback if hotelId not direct
              uniqueHotels[hId] = b.hotelName;
            }
          });

          const loadedThreads = Object.entries(uniqueHotels).map(([hotelId, hotelName]) => ({
            hotelId,
            hotelName,
            roomName: `chat_${hotelId}_${user.id}`,
          }));

          setThreads(loadedThreads);
        }
      } catch (err) {
        console.error('Failed to load chat threads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [user?.id]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>Inbox</Text>
        <Pressable style={styles.iconButton} onPress={() => router.push('/(tabs)/profile/notifications')}>
          <Ionicons name="notifications-outline" size={18} color={RealixColors.textSecondary} />
        </Pressable>
      </View>

      <Pressable style={styles.searchBar}>
        <Ionicons name="search" size={16} color={RealixColors.textMuted} />
        <Text style={styles.searchText}>Search messages</Text>
      </Pressable>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={RealixColors.accent} />
          <Text style={styles.loadingText}>Loading conversations...</Text>
        </View>
      ) : threads.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubble-ellipses-outline" size={60} color={RealixColors.textMuted} />
          <Text style={styles.emptyTitle}>No Messages Yet</Text>
          <Text style={styles.emptySubtitle}>Book a hotel to start chatting with the hotel administration.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {threads.map((thread) => (
            <Pressable 
              key={thread.roomName} 
              style={styles.thread}
              onPress={() => router.push({
                pathname: '/(tabs)/notifications/chat',
                params: { thread: thread.roomName, hotelName: thread.hotelName }
              })}
            >
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarText}>🏨</Text>
                <View style={styles.onlineDot} />
              </View>
              <View style={styles.threadBody}>
                <View style={styles.threadTop}>
                  <Text style={styles.threadName}>{thread.hotelName}</Text>
                  <Text style={styles.threadTime}>Now</Text>
                </View>
                <View style={styles.threadBottom}>
                  <Text style={styles.threadMessage} numberOfLines={1}>
                    Tap to open chat with hotel staff
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={RealixColors.textMuted} />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RealixColors.screenBackground },
  header: { paddingHorizontal: 20, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: '700', color: RealixColors.textPrimary },
  iconButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: RealixColors.cardBackground, borderWidth: 1, borderColor: RealixColors.border },
  searchBar: { marginHorizontal: 20, borderRadius: 12, borderWidth: 1, borderColor: RealixColors.inputBorder, backgroundColor: RealixColors.inputBackground, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
  searchText: { fontSize: 13, color: RealixColors.textMuted },
  content: { paddingHorizontal: 20, paddingVertical: 10, gap: 12 },
  thread: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: RealixColors.cardBackground, borderRadius: 18, borderWidth: 1, borderColor: RealixColors.border, padding: 14 },
  avatarWrap: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#232323', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  avatarText: { fontSize: 24 },
  onlineDot: { position: 'absolute', right: 4, bottom: 4, width: 10, height: 10, borderRadius: 5, backgroundColor: RealixColors.accent, borderWidth: 1, borderColor: RealixColors.cardBackground },
  threadBody: { flex: 1, gap: 6 },
  threadTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  threadName: { fontSize: 14, fontWeight: '700', color: RealixColors.textPrimary },
  threadTime: { fontSize: 11, color: RealixColors.textMuted },
  threadBottom: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  threadMessage: { flex: 1, fontSize: 12, color: RealixColors.textSecondary },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  loadingText: { color: RealixColors.textSecondary, fontSize: 13, marginTop: 10 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, paddingTop: 80, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: RealixColors.textPrimary, marginTop: 12 },
  emptySubtitle: { fontSize: 14, color: RealixColors.textSecondary, textAlign: 'center', lineHeight: 20 },
});