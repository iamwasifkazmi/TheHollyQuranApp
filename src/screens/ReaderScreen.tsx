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
  const [startPage, setStartPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarked, setBookmarked] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const resolve = async () => {
      if (route.params?.page) {
        setStartPage(route.params.page);
        setCurrentPage(route.params.page);
        return;
      }
      if (route.params?.surah) {
        const page = getPageForVerse(
          route.params.surah,
          route.params.ayah ?? 1,
        );
        setStartPage(page);
        setCurrentPage(page);
        return;
      }
      if (settings.preferLastRead) {
        const last = await getLastRead();
        setStartPage(last);
        setCurrentPage(last);
        return;
      }
      const preset = settings.presetStartPage ?? 1;
      setStartPage(preset);
      setCurrentPage(preset);
    };
    resolve();
  }, [route.params, settings.preferLastRead, settings.presetStartPage]);

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
      <PageReader
        initialPage={startPage}
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
