import React, { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Switch, Text, View } from 'react-native';
import {
  RealixCard,
  RealixHeader,
  RealixScreen,
} from '@/src/components/realix/screen-shell';
import {
  RealixColors,
  realixNotificationSections,
} from '@/src/constants/screens/realix';

export default function NotificationSettingsScreen() {
  const initialState = useMemo(() => {
    return realixNotificationSections.reduce<Record<string, boolean>>((accumulator, section) => {
      section.options.forEach((option) => {
        accumulator[option.id] = option.defaultValue;
      });
      return accumulator;
    }, {});
  }, []);

  const [values, setValues] = useState(initialState);

  return (
    <RealixScreen contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <RealixHeader title="Notification Settings" showBack />

      {realixNotificationSections.map((section) => (
        <View key={section.id} style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <RealixCard>
            {section.options.map((option, index) => (
              <View
                key={option.id}
                style={[styles.row, index === section.options.length - 1 && styles.rowLast]}
              >
                <Text style={styles.label}>{option.label}</Text>
                <Switch
                  value={values[option.id]}
                  onValueChange={(nextValue) =>
                    setValues((current) => ({ ...current, [option.id]: nextValue }))
                  }
                  trackColor={{ false: '#3a3a3a', true: RealixColors.accentToggle }}
                  thumbColor="#ffffff"
                />
              </View>
            ))}
          </RealixCard>
        </View>
      ))}
    </RealixScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 0,
  },
  sectionWrap: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: RealixColors.textPrimary,
    paddingHorizontal: 4,
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
    color: RealixColors.textSecondary,
  },
});