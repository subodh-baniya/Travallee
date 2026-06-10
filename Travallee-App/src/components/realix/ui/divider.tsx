import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../../constants/app/color';
import { Typography } from '../../../constants/app/typography';
import { Spacing } from '../../../constants/app/spacing';

interface DividerProps {
  text?: string;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({ text, style }) => {
  if (!text) {
    return <View style={[styles.line, style]} />;
  }
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: Spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  text: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.md,
  },
});

export default Divider;
