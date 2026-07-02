import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { MushafPager } from '../components/MushafPager';
import { PageReaderSkeleton } from '../components/Skeleton';
import {
  getChapter,
  getSurahPageRange,
} from '../services/quranService';
import { toggleBookmark, isBookmarked } from '../services/bookmarkService';
import { useAppTheme } from '../context/SettingsContext';
import { BookmarkIcon, ChevronLeft } from '../components/AppIcon';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import type { RootStackParamList } from '../types/quran';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SurahDetail'>;
  route: RouteProp<RootStackParamList, 'SurahDetail'>;
};

export function SurahDetailScreen({ navigation, route }: Props) {
  const { surahId } = route.params;
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const chapter = getChapter(surahId);
  const [startPage, endPage] = useMemo(
    () => getSurahPageRange(surahId),
    [surahId],
  );
  const [bookmarked, setBookmarked] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    setContentReady(false);
    const frame = requestAnimationFrame(() => {
      setContentReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [surahId]);

  useEffect(() => {
    isBookmarked('surah', { surah: surahId }).then(setBookmarked);
  }, [surahId]);

  const handleBookmark = useCallback(async () => {
    if (!chapter) return;
    const added = await toggleBookmark({
      type: 'surah',
      surah: surahId,
      label: chapter.name,
      subtitle: chapter.nameArabic,
    });
    setBookmarked(added);
  }, [chapter, surahId]);

  if (!chapter) {
    return (
      <View style={styles.error}>
        <Text>Surah not found</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: theme.background },
      ]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ChevronLeft size={28} color={colors.accentLight} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.surahArabic}>{chapter.nameArabic}</Text>
          <Text style={styles.surahName}>{chapter.name}</Text>
          <Text style={styles.surahMeta}>
            {chapter.nameTranslation} · {chapter.versesCount} verses · Pages{' '}
            {startPage}–{endPage}
          </Text>
        </View>
        <TouchableOpacity onPress={handleBookmark} style={styles.bookmarkBtn}>
          <BookmarkIcon active={bookmarked} size={24} color={colors.accent} />
        </TouchableOpacity>
      </View>

      {!contentReady ? (
        <PageReaderSkeleton />
      ) : (
        <MushafPager
          startPage={startPage}
          endPage={endPage}
          initialPage={startPage}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 8,
    gap: 8,
  },
  backBtn: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  surahArabic: {
    fontSize: 26,
    color: colors.accent,
    fontFamily: typography.arabicLarge.fontFamily,
  },
  surahName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textOnPrimary,
    marginTop: 2,
  },
  surahMeta: {
    fontSize: 12,
    color: colors.textOnPrimary,
    opacity: 0.75,
    marginTop: 2,
    textAlign: 'center',
  },
  bookmarkBtn: {
    padding: 8,
  },
});
