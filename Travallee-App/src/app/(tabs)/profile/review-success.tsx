import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RealixHeader, RealixScreen } from '@/src/components/realix/screen-shell';
import { RealixColors, realixReviewCopy } from '@/src/constants/screens/realix';

export default function ReviewSuccessScreen() {
  const router = useRouter();

  return (
    <RealixScreen contentContainerStyle={styles.content} scrollable={false}>
      <StatusBar style="light" />
      <RealixHeader title="Review" showBack />
      <View style={styles.center}>
        <View style={styles.iconWrap}><Ionicons name="checkmark" size={32} color="#000000" /></View>
        <Text style={styles.title}>{realixReviewCopy.title}</Text>
        <Text style={styles.body}>{realixReviewCopy.body}</Text>
        <Pressable style={styles.button} onPress={() => router.replace('/(tabs)/profile')}>
          <Text style={styles.buttonText}>Go To Home</Text>
        </Pressable>
      </View>
    </RealixScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 0 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, gap: 12 },
  iconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: RealixColors.accent, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: RealixColors.textPrimary, textAlign: 'center' },
  body: { fontSize: 13, lineHeight: 20, color: RealixColors.textMuted, textAlign: 'center' },
  button: { minHeight: 44, borderRadius: 22, backgroundColor: RealixColors.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 26 },
  buttonText: { color: '#000000', fontWeight: '700' },
});