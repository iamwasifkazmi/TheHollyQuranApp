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
  getJuzVerses,
  getChapter,
  getPageForVerse,
} from '../services/quranService';
import { toggleBookmark, isBookmarked } from '../services/bookmarkService';
import { BookmarkIcon, ChevronLeft } from '../components/AppIcon';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import type { RootStackParamList } from '../types/quran';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'JuzDetail'>;
  route: RouteProp<RootStackParamList, 'JuzDetail'>;
};

export function JuzDetailScreen({ navigation, route }: Props) {
  const { juzNumber } = route.params;
  const insets = useSafeAreaInsets();
  const verses = getJuzVerses(juzNumber);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    isBookmarked('juz', { juz: juzNumber }).then(setBookmarked);
  }, [juzNumber]);

  const handleBookmark = useCallback(async () => {
    const added = await toggleBookmark({
      type: 'juz',
      juz: juzNumber,
      label: `Juz ${juzNumber}`,
      subtitle: `Para ${juzNumber}`,
    });
    setBookmarked(added);
  }, [juzNumber]);

  const openInMushaf = useCallback(() => {
    if (verses.length > 0) {
      const first = verses[0];
      const page = getPageForVerse(first.surah, first.ayah);
      navigation.navigate('Reader', { page });
    }
  }, [navigation, verses]);

  let lastSurah = 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ChevronLeft size={28} color={colors.accentLight} />
        </TouchableOpacity>
        <Text style={styles.title}>Juz {juzNumber}</Text>
        <Text style={styles.subtitle}>Para {juzNumber} · {verses.length} verses</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleBookmark} style={styles.iconBtn}>
            <BookmarkIcon active={bookmarked} size={24} color={colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity onPress={openInMushaf} style={styles.mushafBtn}>
            <Text style={styles.mushafBtnText}>Open in Mushaf</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {verses.map(verse => {
          const showLabel = verse.surah !== lastSurah;
          lastSurah = verse.surah;
          const chapter = getChapter(verse.surah);
          return (
            <VerseRow
              key={verse.key}
              verse={verse}
              showSurahLabel={showLabel}
              surahName={chapter?.nameArabic}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    alignItems: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textOnPrimary,
    opacity: 0.75,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
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
});
