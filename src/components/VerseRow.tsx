import React from 'react';
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

export function VerseRow({ verse, showSurahLabel, surahName }: VerseRowProps) {
  const { theme, arabicFontSize, arabicLineHeight } = useAppTheme();

  return (
    <View
      style={[styles.container, { borderBottomColor: theme.divider }]}>
      {showSurahLabel && surahName && (
        <Text style={[styles.surahLabel, { color: theme.primary }]}>
          {surahName}
        </Text>
      )}
      <View style={styles.verseRow}>
        <View style={[styles.ayahMarker, { borderColor: theme.accent }]}>
          <Text style={[styles.ayahNumber, { color: theme.accent }]}>
            {toArabicNumeral(verse.ayah)}
          </Text>
        </View>
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
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingVertical: 12,
    marginBottom: 4,
  },
  surahLabel: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  verseRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 10,
  },
  ayahMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  ayahNumber: {
    fontSize: 11,
    fontWeight: '600',
  },
  verseText: {
    fontFamily: typography.arabicMedium.fontFamily,
    textAlign: 'right',
    writingDirection: 'rtl',
    flex: 1,
  },
});
