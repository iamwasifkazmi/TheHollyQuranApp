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
import { PageReader } from '../components/PageReader';
import { getPage, getPageForVerse } from '../services/quranService';
import { toggleBookmark, isBookmarked } from '../services/bookmarkService';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../types/quran';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Reader'>;
  route: RouteProp<RootStackParamList, 'Reader'>;
};

export function ReaderScreen({ navigation, route }: Props) {
  const resolvedPage = useMemo(() => {
    if (route.params?.page) return route.params.page;
    if (route.params?.surah) {
      return getPageForVerse(
        route.params.surah,
        route.params.ayah ?? 1,
      );
    }
    return 1;
  }, [route.params]);

  const insets = useSafeAreaInsets();
  const [currentPage, setCurrentPage] = useState(resolvedPage);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setCurrentPage(resolvedPage);
  }, [resolvedPage]);

  useEffect(() => {
    isBookmarked('page', { page: currentPage }).then(setBookmarked);
  }, [currentPage]);

  const handleBookmark = useCallback(async (page: number) => {
    const pageData = getPage(page);
    const chapterName = pageData?.chapters[0]?.nameEn ?? `Page ${page}`;
    const added = await toggleBookmark({
      type: 'page',
      page,
      label: `Page ${page}`,
      subtitle: chapterName,
    });
    setBookmarked(added);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mushaf Reader</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('PageJump')}
          style={styles.jumpBtn}>
          <Text style={styles.jumpText}>Go to</Text>
        </TouchableOpacity>
      </View>
      <PageReader
        initialPage={resolvedPage}
        onPageChange={setCurrentPage}
        onBookmarkPress={handleBookmark}
        isBookmarked={bookmarked}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    paddingVertical: 4,
  },
  backText: {
    color: colors.accentLight,
    fontSize: 16,
  },
  title: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  jumpBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  jumpText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
});
