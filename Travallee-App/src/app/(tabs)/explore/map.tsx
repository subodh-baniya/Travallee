import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealixColors, realixMapPins } from '@/src/constants/screens/realix';

export default function ExploreMapScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <View style={styles.mapArea}>
        <Pressable style={styles.searchOverlay} onPress={() => router.push('/(tabs)/explore/search')}>
          <Ionicons name="search" size={16} color={RealixColors.textMuted} />
          <Text style={styles.searchText}>Explore</Text>
        </Pressable>

        {realixMapPins.map((pin) => (
          <View
            key={pin.id}
            style={[
              styles.pin,
              pin.active && styles.activePin,
              pin.top !== undefined && { top: pin.top },
              pin.left !== undefined && { left: pin.left },
              pin.right !== undefined && { right: pin.right },
            ]}
          >
            <Text style={[styles.pinText, pin.active && styles.activePinText]}>{pin.label}</Text>
          </View>
        ))}

        <Pressable style={styles.filterButton} onPress={() => router.push('/(tabs)/explore/filter-price')}>
          <Ionicons name="options-outline" size={14} color="#000000" />
          <Text style={styles.filterText}>Filter</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RealixColors.screenBackground },
  mapArea: { flex: 1, backgroundColor: '#1a1a1e', overflow: 'hidden' },
  searchOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    zIndex: 3,
    backgroundColor: RealixColors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: RealixColors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchText: { fontSize: 12, color: RealixColors.textMuted },
  pin: {
    position: 'absolute',
    backgroundColor: RealixColors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: RealixColors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  activePin: { backgroundColor: RealixColors.accent, borderColor: RealixColors.accent },
  pinText: { fontSize: 11, fontWeight: '700', color: RealixColors.textPrimary },
  activePinText: { color: '#000000' },
  filterButton: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: RealixColors.accent,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterText: { fontSize: 12, fontWeight: '700', color: '#000000' },
});