import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealixColors } from '@/src/constants/screens/realix';

export default function InboxScreen() {
  const router = useRouter();

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

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Inbox threads will be rendered here */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RealixColors.screenBackground },
  header: { paddingHorizontal: 20, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: '700', color: RealixColors.textPrimary },
  iconButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: RealixColors.cardBackground, borderWidth: 1, borderColor: RealixColors.border },
  searchBar: { marginHorizontal: 20, borderRadius: 12, borderWidth: 1, borderColor: RealixColors.inputBorder, backgroundColor: RealixColors.inputBackground, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
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
  badge: { minWidth: 18, height: 18, borderRadius: 9, backgroundColor: RealixColors.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#000000' },
});