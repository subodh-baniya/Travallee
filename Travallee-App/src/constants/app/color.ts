// Color palette for Travallee app - Dark theme with neon green accent
export const Colors = {
  // Background colors
  background: '#000000',
  cardBackground: '#1A1A1A',
  inputBackground: '#111111',
  
  // Primary accent (neon green)
  primary: '#00E676',
  primaryDark: '#00C853',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#888888',
  textMuted: '#666666',
  
  // Border colors
  border: '#2A2A2A',
  borderActive: '#00E676',
  
  // Status colors
  success: '#00E676',
  error: '#FF5252',
  warning: '#FFD600',
  
  // Button colors
  buttonText: '#000000',
  buttonDisabled: '#333333',
  buttonDisabledText: '#666666',
  
  // Social button colors
  socialBackground: 'transparent',
  socialBorder: '#2A2A2A',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
} as const;

export type ColorKeys = keyof typeof Colors;
