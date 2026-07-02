import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../context/SettingsContext';
import { typography } from '../theme/typography';
import { toArabicNumeral } from '../utils/arabic';
import type { Verse } from '../types/quran';

interface VerseRowProps {
  verse: Verse;
  showSurahLabel?: boolean;
  surahName?: string;
}

export const VerseRow = memo(function VerseRow({
  verse,
  showSurahLabel,
  surahName,
}: VerseRowProps) {
  const { theme, arabicFontSize, arabicLineHeight } = useAppTheme();

  return (
    <View style={styles.container}>
      {showSurahLabel && surahName ? (
        <Text style={[styles.surahLabel, { color: theme.primary }]}>
          {surahName}
        </Text>
      ) : null}
      <Text
        style={[
          styles.verseText,
          {
            color: theme.textArabic,
            fontSize: arabicFontSize,
            lineHeight: arabicLineHeight,
          },
        ]}>
        {verse.text}
        <Text style={[styles.ayahMarker, { color: theme.accent }]}>
          {' '}
          ﴿{toArabicNumeral(verse.ayah)}﴾
        </Text>
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  surahLabel: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 8,
    fontFamily: typography.arabicMedium.fontFamily,
  },
  verseText: {
    fontFamily: typography.arabicMedium.fontFamily,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  ayahMarker: {
    fontSize: 16,
  },
});
