import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../context/SettingsContext';
import { typography } from '../theme/typography';
import { toArabicNumeral } from '../utils/arabic';
import type { Verse } from '../types/quran';

const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';

interface FlowingVersesProps {
  verses: Verse[];
  showBismillah?: boolean;
}

interface FlowingVerseSection {
  surahName?: string;
  verses: Verse[];
}

interface FlowingVerseSectionsProps {
  sections: FlowingVerseSection[];
}

function AyahFlow({ verses }: { verses: Verse[] }) {
  const { theme, arabicFontSize } = useAppTheme();
  const flowingLineHeight = arabicFontSize * 1.55;

  return (
    <Text
      style={[
        styles.flowingText,
        {
          color: theme.textArabic,
          fontSize: arabicFontSize,
          lineHeight: flowingLineHeight,
        },
      ]}>
      {verses.map((verse, index) => (
        <Text key={verse.key}>
          {verse.text.trim()}
          <Text style={[styles.ayahMarker, { color: theme.accent }]}>
            {' '}
            ﴿{toArabicNumeral(verse.ayah)}﴾
          </Text>
          {index < verses.length - 1 ? '\u00A0' : ''}
        </Text>
      ))}
    </Text>
  );
}

export const FlowingVerses = memo(function FlowingVerses({
  verses,
  showBismillah = false,
}: FlowingVersesProps) {
  const { theme, arabicFontSize } = useAppTheme();

  return (
    <View style={styles.section}>
      {showBismillah && (
        <Text
          style={[
            styles.bismillah,
            { color: theme.primary, fontSize: arabicFontSize },
          ]}>
          {BISMILLAH}
        </Text>
      )}
      <AyahFlow verses={verses} />
    </View>
  );
});

export const FlowingVerseSections = memo(function FlowingVerseSections({
  sections,
}: FlowingVerseSectionsProps) {
  const { theme } = useAppTheme();

  return (
    <View>
      {sections.map(section => (
        <View
          key={`${section.surahName ?? 'surah'}-${section.verses[0]?.key}`}
          style={styles.section}>
          {section.surahName ? (
            <Text style={[styles.surahLabel, { color: theme.primary }]}>
              {section.surahName}
            </Text>
          ) : null}
          <AyahFlow verses={section.verses} />
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  bismillah: {
    fontFamily: typography.arabicMedium.fontFamily,
    textAlign: 'center',
    marginBottom: 20,
    writingDirection: 'rtl',
  },
  surahLabel: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: 14,
    fontFamily: typography.arabicMedium.fontFamily,
  },
  flowingText: {
    fontFamily: typography.arabicMedium.fontFamily,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  ayahMarker: {
    fontSize: 16,
  },
});
