import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealixColors, realixFilterSortOptions, realixPropertyTypes } from '@/src/constants/screens/realix';
import { useSafeNavigation } from '@/src/hooks/useSafeNavigation';

export default function FilterPriceScreen() {
  const { goBack } = useSafeNavigation();
  const [selectedSort, setSelectedSort] = useState(realixFilterSortOptions[0]);
  const [selectedType, setSelectedType] = useState(realixPropertyTypes[0]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.back} onPress={goBack}>
            <Ionicons name="chevron-back" size={18} color={RealixColors.textSecondary} />
          </Pressable>
          <Text style={styles.headerTitle}>Filter</Text>
        </View>
        <Pressable onPress={() => { setSelectedSort(realixFilterSortOptions[0]); setSelectedType(realixPropertyTypes[0]); }}>
          <Text style={styles.reset}>Reset</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Range</Text>
        <View style={styles.histogram}>
          {[8, 12, 18, 22, 20, 22, 18, 15, 10, 6].map((height, index) => (
            <View key={index} style={[styles.histBar, index > 1 && index < 8 && styles.histBarActive, { height }]} />
          ))}
        </View>
        <View style={styles.track}><View style={styles.fill} /></View>
        <View style={styles.rangeLabels}><Text style={styles.rangeText}>$95</Text><Text style={styles.rangeText}>$1,234,567</Text></View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sorting Options</Text>
        {realixFilterSortOptions.map((option) => (
          <Pressable key={option} style={styles.row} onPress={() => setSelectedSort(option)}>
            <Text style={styles.rowText}>{option}</Text>
            <Ionicons name={selectedSort === option ? 'radio-button-on' : 'radio-button-off'} size={18} color={selectedSort === option ? RealixColors.accent : '#444'} />
          </Pressable>
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Property Type</Text>
        <View style={styles.chips}>
          {realixPropertyTypes.map((type) => (
            <Pressable key={type} style={[styles.chip, selectedType === type && styles.chipActive]} onPress={() => setSelectedType(type)}>
              <Text style={[styles.chipText, selectedType === type && styles.chipTextActive]}>{type}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filter Variants</Text>
        <Pressable style={styles.row} onPress={() => router.push('/(tabs)/explore/filter-language')}>
          <Text style={styles.rowText}>Host Language App</Text>
          <Ionicons name="chevron-forward" size={16} color={RealixColors.textMuted} />
        </Pressable>
        <Pressable style={styles.row} onPress={() => router.push('/(tabs)/explore/filter-search')}>
          <Text style={styles.rowText}>Search within filter</Text>
          <Ionicons name="chevron-forward" size={16} color={RealixColors.textMuted} />
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.outlineBtn}><Text style={styles.outlineText}>Reset</Text></Pressable>
        <Pressable style={styles.applyBtn} onPress={() => router.push('/(tabs)/explore/map')}><Text style={styles.applyText}>Apply</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RealixColors.screenBackground },
  header: { paddingHorizontal: 20, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  back: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: RealixColors.textPrimary },
  reset: { fontSize: 12, fontWeight: '600', color: RealixColors.accent },
  section: { paddingHorizontal: 20, paddingVertical: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: RealixColors.textPrimary, marginBottom: 10 },
  histogram: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 26, marginBottom: 8 },
  histBar: { flex: 1, backgroundColor: '#333', borderTopLeftRadius: 2, borderTopRightRadius: 2 },
  histBarActive: { backgroundColor: RealixColors.accent },
  track: { height: 4, backgroundColor: '#333', borderRadius: 2, overflow: 'hidden' },
  fill: { width: '50%', marginLeft: '20%', height: '100%', backgroundColor: RealixColors.accent },
  rangeLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  rangeText: { fontSize: 11, color: RealixColors.textMuted },
  divider: { height: 1, backgroundColor: RealixColors.border },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  rowText: { fontSize: 13, color: RealixColors.textSecondary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: RealixColors.inputBorder, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6 },
  chipActive: { backgroundColor: RealixColors.accent, borderColor: RealixColors.accent },
  chipText: { fontSize: 11, color: RealixColors.textSecondary },
  chipTextActive: { color: '#000000', fontWeight: '700' },
  footer: { marginTop: 'auto', paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row', gap: 10 },
  outlineBtn: { flex: 1, borderWidth: 1, borderColor: RealixColors.inputBorder, borderRadius: 20, alignItems: 'center', justifyContent: 'center', minHeight: 40 },
  outlineText: { color: RealixColors.textSecondary, fontWeight: '600' },
  applyBtn: { flex: 1, backgroundColor: RealixColors.accent, borderRadius: 20, alignItems: 'center', justifyContent: 'center', minHeight: 40 },
  applyText: { color: '#000000', fontWeight: '700' },
});