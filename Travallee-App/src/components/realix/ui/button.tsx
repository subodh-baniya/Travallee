import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '../../../constants/app/color';
import { Spacing } from '../../../constants/app/spacing';
import { Typography } from '../../../constants/app/typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [styles.base];
    
    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primary);
        if (disabled) baseStyle.push(styles.primaryDisabled);
        break;
      case 'secondary':
        baseStyle.push(styles.secondary);
        break;
      case 'outline':
        baseStyle.push(styles.outline);
        break;
      case 'text':
        baseStyle.push(styles.text);
        break;
    }
    
    return baseStyle;
  };
  
  const getTextStyle = (): TextStyle[] => {
    const baseStyle: TextStyle[] = [styles.buttonText];
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryText);
        if (disabled) baseStyle.push(styles.disabledText);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryText);
        break;
      case 'outline':
        baseStyle.push(styles.outlineText);
        break;
      case 'text':
        baseStyle.push(styles.textButtonText);
        break;
    }
    
    return baseStyle;
  };
  
  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? Colors.buttonText : Colors.primary} 
        />
      ) : (
        <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: Spacing.buttonHeight,
    borderRadius: Spacing.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  primaryDisabled: {
    backgroundColor: Colors.buttonDisabled,
  },
  secondary: {
    backgroundColor: Colors.cardBackground,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    ...Typography.button,
  },
  primaryText: {
    color: Colors.buttonText,
  },
  disabledText: {
    color: Colors.buttonDisabledText,
  },
  secondaryText: {
    color: Colors.textPrimary,
  },
  outlineText: {
    color: Colors.textPrimary,
  },
  textButtonText: {
    color: Colors.primary,
  },
});

export default Button;
