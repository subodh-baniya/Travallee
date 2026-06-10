import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/app/color';
import { Spacing } from '../../../constants/app/spacing';
import { Typography } from '../../../constants/app/typography';

interface NumberPadProps {
  onPress: (value: string) => void;
  onBackspace: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

const keys = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['*', '0', 'backspace'],
];

export const NumberPad: React.FC<NumberPadProps> = ({
  onPress,
  onBackspace,
  style,
  disabled = false,
}) => {
  const handleKeyPress = (key: string) => {
    if (disabled) return;
    
    if (key === 'backspace') {
      onBackspace();
    } else {
      onPress(key);
    }
  };
  
  return (
    <View style={[styles.container, style]}>
      {keys.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.key,
                key === '*' && styles.emptyKey,
              ]}
              onPress={() => handleKeyPress(key)}
              activeOpacity={0.7}
              disabled={disabled || key === '*'}
            >
              {key === 'backspace' ? (
                <Ionicons
                  name="backspace-outline"
                  size={24}
                  color={Colors.textPrimary}
                />
              ) : key === '*' ? null : (
                <Text style={styles.keyText}>{key}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  key: {
    width: Spacing.numpadKeyWidth,
    height: Spacing.numpadKeyHeight,
    backgroundColor: Colors.cardBackground,
    borderRadius: Spacing.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyKey: {
    backgroundColor: 'transparent',
  },
  keyText: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
});

export default NumberPad;
