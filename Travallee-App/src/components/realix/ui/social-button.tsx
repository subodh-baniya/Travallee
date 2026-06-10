import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/app/color';
import { Spacing } from '../../../constants/app/spacing';
import { Typography } from '../../../constants/app/typography';

type SocialProvider = 'google' | 'facebook' | 'apple';

interface SocialButtonProps {
  provider: SocialProvider;
  onPress: () => void;
  title?: string;
  style?: ViewStyle;
}

const socialIcons: Record<SocialProvider, keyof typeof Ionicons.glyphMap> = {
  google: 'logo-google',
  facebook: 'logo-facebook',
  apple: 'logo-apple',
};

const providerNames: Record<SocialProvider, string> = {
  google: 'Google',
  facebook: 'Facebook',
  apple: 'Apple',
};

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onPress,
  title,
  style,
}) => {
  const displayTitle = title || providerNames[provider];
  
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Ionicons 
          name={socialIcons[provider]} 
          size={20} 
          color={Colors.textPrimary}
        />
      </View>
      <Text style={styles.text}>{displayTitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: Spacing.buttonHeight,
    backgroundColor: 'transparent',
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...Typography.button,
    color: Colors.textPrimary,
  },
});

export default SocialButton;
