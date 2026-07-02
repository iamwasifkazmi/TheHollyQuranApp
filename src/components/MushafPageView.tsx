import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../context/SettingsContext';
import { typography } from '../theme/typography';
import { getMushafPage } from '../services/quranService';
import { getPageBackground } from '../services/settingsService';
import { MushafLineText } from '../utils/mushafText';
import type { MushafLine } from '../types/quran';

const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';

function getLineText(line: MushafLine): string {
  if (line.type === 'basmala') {
    return BISMILLAH;
  }
  return (line.text ?? '').trim();
}

interface MushafPageViewProps {
  pageNumber: number;
}

export const MushafPageView = memo(function MushafPageView({
  pageNumber,
}: MushafPageViewProps) {
  const { theme, settings } = useAppTheme();
  const pageBg = getPageBackground(settings.pageBrightness, settings.darkMode);
  const mushafPage = getMushafPage(pageNumber);
  const lines = mushafPage?.lines ?? [];
  const textFontSize = settings.arabicFontSize;
  const headerFontSize = settings.arabicFontSize + 4;
  const lineColor = settings.darkMode ? '#3A5248' : '#C8C0B4';

  if (lines.length === 0) {
    return (
      <View style={[styles.emptyPage, { backgroundColor: pageBg }]}>
        <Text style={{ color: theme.textMuted }}>Page {pageNumber}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.page, { backgroundColor: pageBg }]}>
      {lines.map(line => {
        const isHeader = line.type === 'surah-header';
        const isBasmala = line.type === 'basmala';
        const fontSize = isHeader ? headerFontSize : textFontSize;
        const lineText = getLineText(line);

        return (
          <View
            key={`${pageNumber}-${line.line}-${line.type}`}
            style={[styles.lineSlot, { borderBottomColor: lineColor }]}>
            {isHeader || isBasmala ? (
              <Text
                style={[
                  styles.lineText,
                  {
                    color: isHeader ? theme.primary : theme.textArabic,
                    fontSize,
                    fontFamily: typography.arabicMedium.fontFamily,
                  },
                  isHeader && styles.surahHeader,
                  isBasmala && styles.basmala,
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
                allowFontScaling={false}>
                {lineText}
              </Text>
            ) : (
              <MushafLineText
                text={lineText}
                ayahColor={theme.accentLight}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
                style={[
                  styles.lineText,
                  {
                    color: theme.textArabic,
                    fontSize,
                    fontFamily: typography.arabicMedium.fontFamily,
                  },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  lineSlot: {
    flex: 1,
    justifyContent: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: 4,
  },
  lineText: {
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  surahHeader: {
    fontWeight: '600',
  },
  basmala: {
    letterSpacing: 0.5,
  },
  emptyPage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
