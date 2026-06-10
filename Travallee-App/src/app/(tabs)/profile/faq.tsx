import React, { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  RealixCard,
  RealixHeader,
  RealixScreen,
} from '@/src/components/realix/screen-shell';
import { RealixColors, realixFaqs } from '@/src/constants/screens/realix';

export default function FaqScreen() {
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string>('');

  const filteredFaqs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return realixFaqs;
    }

    return realixFaqs.filter((item) => {
      return (
        item.question.toLowerCase().includes(normalizedQuery) ||
        item.answer.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query]);

  return (
    <RealixScreen contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <RealixHeader title="FAQs" showBack />

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={RealixColors.textCaption} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search"
          placeholderTextColor={RealixColors.textCaption}
          style={styles.searchInput}
        />
      </View>

      <Text style={styles.heading}>Frequently Asked</Text>
      <RealixCard>
        {filteredFaqs.map((item, index) => {
          const isOpen = openId === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setOpenId(isOpen ? '' : item.id)}
              style={[styles.item, index === filteredFaqs.length - 1 && styles.lastItem]}
            >
              <View style={styles.questionRow}>
                <Text style={styles.question}>{item.question}</Text>
                <Ionicons
                  name={isOpen ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={RealixColors.textMuted}
                />
              </View>
              {isOpen ? <Text style={styles.answer}>{item.answer}</Text> : null}
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
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: RealixColors.inputBackground,
    borderWidth: 1,
    borderColor: RealixColors.inputBorder,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: RealixColors.textPrimary,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },
  item: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: RealixColors.border,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  question: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: RealixColors.textPrimary,
  },
  answer: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 21,
    color: RealixColors.textSecondary,
  },
});