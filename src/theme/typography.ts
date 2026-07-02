import { Platform, TextStyle } from 'react-native';

export const fonts = {
  arabic: Platform.select({
    ios: 'Geeza Pro',
    android: 'sans-serif',
    default: 'System',
  }),
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  arabicLarge: {
    fontSize: 26,
    lineHeight: 48,
    fontFamily: fonts.arabic,
    textAlign: 'right' as TextStyle['textAlign'],
    writingDirection: 'rtl' as TextStyle['writingDirection'],
  },
  arabicMedium: {
    fontSize: 22,
    lineHeight: 42,
    fontFamily: fonts.arabic,
    textAlign: 'right' as TextStyle['textAlign'],
    writingDirection: 'rtl' as TextStyle['writingDirection'],
  },
  arabicSmall: {
    fontSize: 18,
    lineHeight: 36,
    fontFamily: fonts.arabic,
    textAlign: 'right' as TextStyle['textAlign'],
    writingDirection: 'rtl' as TextStyle['writingDirection'],
  },
};
