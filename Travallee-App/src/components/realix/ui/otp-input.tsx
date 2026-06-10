import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { Colors } from '../../../constants/app/color';
import { Spacing } from '../../../constants/app/spacing';
import { Typography } from '../../../constants/app/typography';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  style?: ViewStyle;
  autoFocus?: boolean;
  disabled?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 4,
  value,
  onChange,
  style,
  autoFocus = false,
  disabled = false,
}) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);
  
  const handleChange = (text: string, index: number) => {
    const newValue = value.split('');
    
    if (text.length > 1) {
      // Handle paste
      const pastedValue = text.slice(0, length);
      onChange(pastedValue);
      const lastIndex = Math.min(pastedValue.length, length) - 1;
      inputRefs.current[lastIndex]?.focus();
      return;
    }
    
    newValue[index] = text;
    const newOtp = newValue.join('').slice(0, length);
    onChange(newOtp);
    
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.inputContainer,
            focusedIndex === index && styles.inputContainerFocused,
            value[index] && styles.inputContainerFilled,
          ]}
        >
          <TextInput
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={styles.input}
            value={value[index] || ''}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            keyboardType="number-pad"
            maxLength={index === 0 ? length : 1}
            editable={!disabled}
            selectTextOnFocus
            caretHidden
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  inputContainer: {
    width: Spacing.otpBoxSize,
    height: Spacing.otpBoxSize,
    backgroundColor: Colors.cardBackground,
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainerFocused: {
    borderColor: Colors.primary,
  },
  inputContainerFilled: {
    borderColor: Colors.primary,
  },
  input: {
    ...Typography.h2,
    color: Colors.textPrimary,
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
});

export default OTPInput;
