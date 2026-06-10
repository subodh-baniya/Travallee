import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealixColors } from '@/src/constants/screens/realix';
import { useSafeNavigation } from '@/src/hooks/useSafeNavigation';

export default function FilterSearchScreen() {
  const { goBack } = useSafeNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={goBack}><Ionicons name="chevron-back" size={18} color={RealixColors.textSecondary} /></Pressable>
          <Text style={styles.title}>Filter</Text>
        </View>
        <Text style={styles.reset}>Reset</Text>
      </View>

      <View style={styles.centerWrap}>
        <View style={styles.iconWrap}>
          <Ionicons name="search" size={28} color={RealixColors.textMuted} />
        </View>
        <Text style={styles.body}>Please select a category first to search within available options.</Text>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.outlineBtn}><Text style={styles.outlineText}>Reset</Text></Pressable>
        <Pressable style={styles.applyBtn} onPress={goBack}><Text style={styles.applyText}>Apply</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RealixColors.screenBackground },
  header: { paddingHorizontal: 20, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 20, fontWeight: '700', color: RealixColors.textPrimary },
  reset: { fontSize: 12, fontWeight: '600', color: RealixColors.accent },
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 14 },
  iconWrap: { width: 72, height: 72, borderRadius: 36, borderWidth: 1, borderColor: RealixColors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: RealixColors.cardBackground },
  body: { textAlign: 'center', fontSize: 13, lineHeight: 20, color: RealixColors.textMuted },
  footer: { paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row', gap: 10 },
  outlineBtn: { flex: 1, borderWidth: 1, borderColor: RealixColors.inputBorder, borderRadius: 20, alignItems: 'center', justifyContent: 'center', minHeight: 40 },
  outlineText: { color: RealixColors.textSecondary, fontWeight: '600' },
  applyBtn: { flex: 1, backgroundColor: RealixColors.accent, borderRadius: 20, alignItems: 'center', justifyContent: 'center', minHeight: 40 },
  applyText: { color: '#000000', fontWeight: '700' },
});