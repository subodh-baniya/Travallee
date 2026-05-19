import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealixColors, realixLanguages } from '@/src/constants/screens/realix';
import { useSafeNavigation } from '@/src/hooks/useSafeNavigation';

export default function FilterLanguageScreen() {
  const { goBack } = useSafeNavigation();
  const [selected, setSelected] = useState('Italian');

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

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Host Language App</Text>
        {realixLanguages.map((language) => (
          <Pressable key={language} style={styles.row} onPress={() => setSelected(language)}>
            <Text style={styles.label}>{language}</Text>
            <Ionicons name={selected === language ? 'radio-button-on' : 'radio-button-off'} size={18} color={selected === language ? RealixColors.accent : '#444'} />
          </Pressable>
        ))}
      </ScrollView>

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
  content: { paddingHorizontal: 20, paddingBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: RealixColors.textPrimary, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: RealixColors.border },
  label: { fontSize: 14, color: RealixColors.textPrimary },
  footer: { paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row', gap: 10 },
  outlineBtn: { flex: 1, borderWidth: 1, borderColor: RealixColors.inputBorder, borderRadius: 20, alignItems: 'center', justifyContent: 'center', minHeight: 40 },
  outlineText: { color: RealixColors.textSecondary, fontWeight: '600' },
  applyBtn: { flex: 1, backgroundColor: RealixColors.accent, borderRadius: 20, alignItems: 'center', justifyContent: 'center', minHeight: 40 },
  applyText: { color: '#000000', fontWeight: '700' },
});