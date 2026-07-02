import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { VerseRow } from '../components/VerseRow';
import {
  getChapter,
  getSurahVerses,
  getPageForVerse,
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
  const { theme, arabicFontSize } = useAppTheme();
  const chapter = getChapter(surahId);
  const verses = getSurahVerses(surahId);
  const [bookmarked, setBookmarked] = useState(false);

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

  const openInMushaf = useCallback(() => {
    const page = getPageForVerse(surahId, 1);
    navigation.navigate('Reader', { page, surah: surahId });
  }, [navigation, surahId]);

  if (!chapter) {
    return (
      <View style={styles.error}>
        <Text>Surah not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
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
            {chapter.pages[0]}–{chapter.pages[1]}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleBookmark} style={styles.iconBtn}>
            <BookmarkIcon active={bookmarked} size={24} color={colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity onPress={openInMushaf} style={styles.mushafBtn}>
            <Text style={styles.mushafBtnText}>Mushaf</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {surahId !== 1 && surahId !== 9 && (
          <Text style={[styles.bismillah, { color: theme.primary, fontSize: arabicFontSize }]}>
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </Text>
        )}
        {verses.map(verse => (
          <VerseRow key={verse.key} verse={verse} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  backBtn: {
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  headerCenter: {
    alignItems: 'center',
  },
  surahArabic: {
    fontSize: 32,
    color: colors.accent,
    fontFamily: typography.arabicLarge.fontFamily,
  },
  surahName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textOnPrimary,
    marginTop: 4,
  },
  surahMeta: {
    fontSize: 13,
    color: colors.textOnPrimary,
    opacity: 0.75,
    marginTop: 4,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  iconBtn: {
    padding: 8,
  },
  mushafBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  mushafBtnText: {
    color: colors.primaryDark,
    fontWeight: '600',
    fontSize: 14,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  bismillah: {
    ...typography.arabicMedium,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
});
