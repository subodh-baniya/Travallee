import { TextStyle } from 'react-native';

// Typography styles for consistent text rendering
export const Typography: Record<string, TextStyle> = {
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  
  // Body text
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  
  // Labels
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  
  // Button text
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  
  // Caption
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
} as const;
