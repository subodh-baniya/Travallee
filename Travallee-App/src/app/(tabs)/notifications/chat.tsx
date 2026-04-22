import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealixColors, realixInboxThreads } from '@/src/constants/screens/realix';

export default function InboxChatScreen() {
  const router = useRouter();
  const { thread } = useLocalSearchParams<{ thread?: string }>();
  const currentThread = realixInboxThreads.find((item) => item.id === thread) ?? realixInboxThreads[0];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()}><Ionicons name="chevron-back" size={18} color={RealixColors.textSecondary} /></Pressable>
          <View style={styles.avatarWrap}><Text style={styles.avatarText}>{currentThread.avatar}</Text></View>
          <View>
            <Text style={styles.name}>{currentThread.name}</Text>
            <Text style={styles.meta}>{currentThread.online ? 'Active now' : 'Offline'}</Text>
          </View>
        </View>
        <Pressable style={styles.videoButton} onPress={() => router.push({ pathname: '/(tabs)/notifications/video-call', params: { thread: currentThread.id } })}>
          <Ionicons name="videocam-outline" size={18} color={RealixColors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Chat messages will be rendered here */}
      </ScrollView>

      <View style={styles.composer}>
        <Pressable style={styles.smallIcon}><Ionicons name="happy-outline" size={18} color={RealixColors.textMuted} /></Pressable>
        <View style={styles.input}><Text style={styles.inputText}>Typing message...</Text></View>
        <Pressable style={styles.sendButton}><Ionicons name="send" size={16} color="#000000" /></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RealixColors.screenBackground },
  header: { paddingHorizontal: 20, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarWrap: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#232323', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20 },
  name: { fontSize: 14, fontWeight: '700', color: RealixColors.textPrimary },
  meta: { fontSize: 11, color: RealixColors.textMuted },
  videoButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: RealixColors.cardBackground, borderWidth: 1, borderColor: RealixColors.border },
  content: { paddingHorizontal: 20, paddingVertical: 10, gap: 10 },
  time: { alignSelf: 'center', fontSize: 11, color: RealixColors.textMuted, marginVertical: 8 },
  messageRow: { flexDirection: 'row' },
  rowStart: { justifyContent: 'flex-start' },
  rowEnd: { justifyContent: 'flex-end' },
  messageBubble: { maxWidth: '78%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleIncoming: { backgroundColor: RealixColors.cardBackground, borderWidth: 1, borderColor: RealixColors.border },
  bubbleOutgoing: { backgroundColor: RealixColors.accent },
  messageText: { fontSize: 13, lineHeight: 19 },
  textIncoming: { color: RealixColors.textPrimary },
  textOutgoing: { color: '#000000', fontWeight: '600' },
  composer: { paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  smallIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: RealixColors.cardBackground, borderWidth: 1, borderColor: RealixColors.border, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, minHeight: 42, borderRadius: 21, backgroundColor: RealixColors.inputBackground, borderWidth: 1, borderColor: RealixColors.inputBorder, justifyContent: 'center', paddingHorizontal: 14 },
  inputText: { fontSize: 13, color: RealixColors.textMuted },
  sendButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: RealixColors.accent, alignItems: 'center', justifyContent: 'center' },
});