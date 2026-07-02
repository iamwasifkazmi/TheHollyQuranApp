import React, { useCallback, useEffect, useState } from 'react';
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
import { PageReaderSkeleton } from '../components/Skeleton';
import { getPage, getPageForVerse } from '../services/quranService';
import { toggleBookmark, isBookmarked, getLastRead } from '../services/bookmarkService';
import { useAppTheme } from '../context/SettingsContext';
import { ChevronLeft } from '../components/AppIcon';
import type { RootStackParamList } from '../types/quran';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Reader'>;
  route: RouteProp<RootStackParamList, 'Reader'>;
};

export function ReaderScreen({ navigation, route }: Props) {
  const { theme, settings } = useAppTheme();
  const [startPage, setStartPage] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarked, setBookmarked] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let cancelled = false;

    const resolve = () => {
      if (route.params?.page) {
        return route.params.page;
      }
      if (route.params?.surah) {
        return getPageForVerse(route.params.surah, route.params.ayah ?? 1);
      }
      if (settings.preferLastRead) {
        return getLastRead();
      }
      return Promise.resolve(settings.presetStartPage ?? 1);
    };

    const run = async () => {
      const result = await resolve();
      if (!cancelled) {
        setStartPage(result);
        setCurrentPage(result);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [route.params, settings.preferLastRead, settings.presetStartPage]);

  useEffect(() => {
    if (startPage) {
      isBookmarked('page', { page: currentPage }).then(setBookmarked);
    }
  }, [currentPage, startPage]);

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

  const isLoading = startPage === null;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: theme.background },
      ]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primaryDark} />
      <View style={[styles.topBar, { backgroundColor: theme.primaryDark }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ChevronLeft size={28} color={theme.accentLight} />
        </TouchableOpacity>
        <Text style={styles.title}>Mushaf Reader</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('PageJump')}
          style={[styles.jumpBtn, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.jumpText, { color: theme.accent }]}>Go to</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <PageReaderSkeleton />
      ) : (
        <PageReader
          initialPage={startPage}
          onPageChange={setCurrentPage}
          onBookmarkPress={handleBookmark}
          isBookmarked={bookmarked}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    paddingVertical: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  jumpBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  jumpText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
