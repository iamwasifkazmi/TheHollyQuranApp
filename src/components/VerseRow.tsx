import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import type { Verse } from '../types/quran';

interface VerseRowProps {
  verse: Verse;
  showSurahLabel?: boolean;
  surahName?: string;
}

function toArabicNumeral(num: number): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num)
    .split('')
    .map(d => arabicDigits[parseInt(d, 10)])
    .join('');
}

export function VerseRow({ verse, showSurahLabel, surahName }: VerseRowProps) {
  return (
    <View style={styles.container}>
      {showSurahLabel && surahName && (
        <Text style={styles.surahLabel}>{surahName}</Text>
      )}
      <View style={styles.verseRow}>
        <View style={styles.ayahMarker}>
          <Text style={styles.ayahNumber}>{toArabicNumeral(verse.ayah)}</Text>
        </View>
        <Text style={styles.verseText}>{verse.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  surahLabel: {
    ...typography.h3,
    color: colors.primary,
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
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  ayahNumber: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '600',
  },
  verseText: {
    ...typography.arabicMedium,
    color: colors.textArabic,
    flex: 1,
  },
});
