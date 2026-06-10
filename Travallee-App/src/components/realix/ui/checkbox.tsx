import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors } from '../../../constants/app/color';
import { Spacing } from '../../../constants/app/spacing';
import { Typography } from '../../../constants/app/typography';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label?: string;
  labelComponent?: React.ReactNode;
  style?: ViewStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onToggle,
  label,
  labelComponent,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </View>
      {labelComponent ? (
        labelComponent
      ) : label ? (
        <Text style={styles.label}>{label}</Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: Spacing.borderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.buttonText,
    fontSize: 14,
    fontWeight: '700',
  },
  label: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
  },
});

export default Checkbox;
