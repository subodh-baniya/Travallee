import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text } from 'react-native';
import {
  RealixCard,
  RealixHeader,
  RealixScreen,
} from '@/src/components/realix/screen-shell';
import { RealixColors, realixLanguages } from '@/src/constants/screens/realix';

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('Italian');

  return (
    <RealixScreen contentContainerStyle={styles.content}>
      <StatusBar style="dark" />
      <RealixHeader title="Language" showBack />

      <RealixCard>
        {realixLanguages.map((language, index) => {
          const isSelected = selectedLanguage === language;

          return (
            <Pressable
              key={language}
              onPress={() => setSelectedLanguage(language)}
              style={[styles.row, index === realixLanguages.length - 1 && styles.rowLast]}
            >
              <Text style={styles.label}>{language}</Text>
              <Ionicons
                name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color={isSelected ? RealixColors.accentToggle : '#d0d0d0'}
              />
            </Pressable>
          );
        })}
      </RealixCard>
    </RealixScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 0,
  },
  row: {
    minHeight: 58,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: RealixColors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 15,
    color: RealixColors.textPrimary,
  },
});