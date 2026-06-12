import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { RealixHeader, RealixScreen } from '@/src/components/realix/screen-shell';
import { RealixColors } from '@/src/constants/screens/realix';

export default function ProfileReviewScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(4);

  return (
    <RealixScreen contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <RealixHeader title="Review" showBack />

      <View style={styles.hero}>
        <View style={styles.heroImage}><Text style={styles.heroEmoji}>🏖️</Text></View>
        <Text style={styles.heroTitle}>Pullman Legian Bali</Text>
        <Text style={styles.heroMeta}>1 room, 2 Adults</Text>
      </View>

      <Text style={styles.prompt}>How was your stay?</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => setRating(star)}>
            <Ionicons name={star <= rating ? 'star' : 'star-outline'} size={26} color={RealixColors.orange} />
          </Pressable>
        ))}
      </View>

      <View style={styles.inputWrap}>
        <TextInput
          multiline
          numberOfLines={6}
          placeholder="Write review"
          placeholderTextColor={RealixColors.textMuted}
          style={styles.input}
        />
      </View>

      <Pressable style={styles.button} onPress={() => router.push('/(tabs)/profile/review-success')}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </RealixScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 0 },
  hero: { alignItems: 'center', gap: 6, paddingVertical: 8 },
  heroImage: { width: 92, height: 92, borderRadius: 20, backgroundColor: '#232323', alignItems: 'center', justifyContent: 'center' },
  heroEmoji: { fontSize: 42 },
  heroTitle: { fontSize: 20, fontWeight: '700', color: RealixColors.textPrimary },
  heroMeta: { fontSize: 12, color: RealixColors.textMuted },
  prompt: { fontSize: 16, fontWeight: '700', color: RealixColors.textPrimary },
  stars: { flexDirection: 'row', gap: 10 },
  inputWrap: { minHeight: 160, borderRadius: 18, borderWidth: 1, borderColor: RealixColors.inputBorder, backgroundColor: RealixColors.inputBackground, padding: 14 },
  input: { minHeight: 130, textAlignVertical: 'top', color: RealixColors.textPrimary, fontSize: 14 },
  button: { minHeight: 44, borderRadius: 22, backgroundColor: RealixColors.accent, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#000000', fontWeight: '700', fontSize: 14 },
});