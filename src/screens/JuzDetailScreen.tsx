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
import { getJuzPageRange } from '../services/quranService';
import { toggleBookmark, isBookmarked } from '../services/bookmarkService';
import { useAppTheme } from '../context/SettingsContext';
import { BookmarkIcon, ChevronLeft } from '../components/AppIcon';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../types/quran';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'JuzDetail'>;
  route: RouteProp<RootStackParamList, 'JuzDetail'>;
};

export function JuzDetailScreen({ navigation, route }: Props) {
  const { juzNumber } = route.params;
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const [startPage, endPage] = useMemo(
    () => getJuzPageRange(juzNumber),
    [juzNumber],
  );
  const [bookmarked, setBookmarked] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    setContentReady(false);
    const frame = requestAnimationFrame(() => {
      setContentReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [juzNumber]);

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

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: theme.background },
      ]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ChevronLeft size={28} color={colors.accentLight} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Juz {juzNumber}</Text>
          <Text style={styles.subtitle}>
            Para {juzNumber} · Pages {startPage}–{endPage}
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textOnPrimary,
    opacity: 0.75,
    marginTop: 2,
  },
  bookmarkBtn: {
    padding: 8,
  },
});
