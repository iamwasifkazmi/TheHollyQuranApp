import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MushafPager } from './MushafPager';
import { BookmarkIcon } from './AppIcon';
import { useAppTheme } from '../context/SettingsContext';
import { getTotalPages } from '../services/quranService';
import { saveLastRead } from '../services/bookmarkService';

interface PageReaderProps {
  initialPage?: number;
  onPageChange?: (page: number) => void;
  onBookmarkPress?: (page: number) => void;
  isBookmarked?: boolean;
}

export function PageReader({
  initialPage = 1,
  onPageChange,
  onBookmarkPress,
  isBookmarked = false,
}: PageReaderProps) {
  const { theme } = useAppTheme();
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      saveLastRead(page);
      onPageChange?.(page);
    },
    [onPageChange],
  );

  const toolbarRight =
    onBookmarkPress != null ? (
      <TouchableOpacity
        style={styles.bookmarkBtn}
        onPress={() => onBookmarkPress(currentPage)}>
        <BookmarkIcon active={isBookmarked} size={24} color={theme.accent} />
      </TouchableOpacity>
    ) : undefined;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <MushafPager
        startPage={1}
        endPage={getTotalPages()}
        initialPage={initialPage}
        onPageChange={handlePageChange}
        indicatorMode="full"
        toolbarRight={toolbarRight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bookmarkBtn: {
    padding: 8,
  },
});
