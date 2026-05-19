import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealixColors, realixInboxThreads } from '@/src/constants/screens/realix';
import { useSafeNavigation } from '@/src/hooks/useSafeNavigation';

export default function VideoCallScreen() {
  const { goBack } = useSafeNavigation();
  const { thread } = useLocalSearchParams<{ thread?: string }>();
  const currentThread = realixInboxThreads.find((item) => item.id === thread) ?? realixInboxThreads[0];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <View style={styles.stage}>
        <View style={styles.remoteCard}>
          <Text style={styles.remoteAvatar}>{currentThread.avatar}</Text>
          <Text style={styles.remoteName}>{currentThread.name}</Text>
          <Text style={styles.remoteMeta}>Connecting in demo mode...</Text>
        </View>
        <View style={styles.selfPreview}><Text style={styles.selfText}>You</Text></View>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.action}><Ionicons name="mic-off-outline" size={18} color={RealixColors.textPrimary} /></Pressable>
        <Pressable style={styles.action}><Ionicons name="videocam-off-outline" size={18} color={RealixColors.textPrimary} /></Pressable>
        <Pressable style={styles.actionDanger} onPress={goBack}><Ionicons name="call" size={18} color="#ffffff" /></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080808' },
  stage: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  remoteCard: { width: '100%', maxWidth: 320, borderRadius: 28, backgroundColor: '#141414', borderWidth: 1, borderColor: '#232323', alignItems: 'center', paddingVertical: 40, gap: 10 },
  remoteAvatar: { fontSize: 56 },
  remoteName: { fontSize: 22, fontWeight: '700', color: '#f0f0f0' },
  remoteMeta: { fontSize: 12, color: '#8a8a8a' },
  selfPreview: { position: 'absolute', right: 20, top: 24, width: 92, height: 132, borderRadius: 18, backgroundColor: '#1d1d1d', borderWidth: 1, borderColor: '#2e2e2e', alignItems: 'center', justifyContent: 'center' },
  selfText: { color: '#f0f0f0', fontWeight: '700' },
  actions: { paddingHorizontal: 32, paddingBottom: 24, flexDirection: 'row', justifyContent: 'center', gap: 18 },
  action: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#1c1c1c', borderWidth: 1, borderColor: '#2d2d2d', alignItems: 'center', justifyContent: 'center' },
  actionDanger: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#ff4d4f', alignItems: 'center', justifyContent: 'center' },
});