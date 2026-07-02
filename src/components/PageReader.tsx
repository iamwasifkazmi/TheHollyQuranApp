import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { getPage, getTotalPages } from '../services/quranService';
import { saveLastRead } from '../services/bookmarkService';
import type { Page } from '../types/quran';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PageReaderProps {
  initialPage?: number;
  onPageChange?: (page: number) => void;
  onBookmarkPress?: (page: number) => void;
  isBookmarked?: boolean;
}

function toArabicNumeral(num: number): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num)
    .split('')
    .map(d => arabicDigits[parseInt(d, 10)])
    .join('');
}

function PageContent({ page }: { page: Page }) {
  const chapterInfo = page.chapters[0];

  return (
    <ScrollView
      style={styles.pageScroll}
      contentContainerStyle={styles.pageContent}
      showsVerticalScrollIndicator={false}>
      {chapterInfo && (
        <View style={styles.header}>
          <Text style={styles.surahNameAr}>{chapterInfo.nameAr}</Text>
          <Text style={styles.surahNameEn}>{chapterInfo.nameEn}</Text>
        </View>
      )}
      <View style={styles.versesContainer}>
        {page.verses.map((verse, idx) => (
          <Text key={`${verse.key}-${idx}`} style={styles.verseInline}>
            {verse.text}
            <Text style={styles.ayahEnd}> ﴿{toArabicNumeral(verse.ayah)}﴾ </Text>
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

export function PageReader({
  initialPage = 1,
  onPageChange,
  onBookmarkPress,
  isBookmarked = false,
}: PageReaderProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const pagerRef = React.useRef<PagerView>(null);
  const totalPages = getTotalPages();

  useEffect(() => {
    if (initialPage !== currentPage) {
      pagerRef.current?.setPageWithoutAnimation(initialPage - 1);
      setCurrentPage(initialPage);
    }
  }, [initialPage]);

  const handlePageSelected = useCallback(
    (e: { nativeEvent: { position: number } }) => {
      const page = e.nativeEvent.position + 1;
      setCurrentPage(page);
      saveLastRead(page);
      onPageChange?.(page);
    },
    [onPageChange],
  );

  const goToPage = (page: number) => {
    const clamped = Math.max(1, Math.min(604, page));
    pagerRef.current?.setPage(clamped - 1);
    setCurrentPage(clamped);
  };

  const pageData = getPage(currentPage);

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}>
          <Text style={[styles.navText, currentPage <= 1 && styles.navDisabled]}>
            ‹ Prev
          </Text>
        </TouchableOpacity>

        <View style={styles.pageIndicator}>
          <Text style={styles.pageNumber}>{currentPage}</Text>
          <Text style={styles.pageTotal}>/ {totalPages}</Text>
          {pageData?.juzNumber && (
            <Text style={styles.juzLabel}>Juz {pageData.juzNumber}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}>
          <Text
            style={[
              styles.navText,
              currentPage >= totalPages && styles.navDisabled,
            ]}>
            Next ›
          </Text>
        </TouchableOpacity>

        {onBookmarkPress && (
          <TouchableOpacity
            style={styles.bookmarkBtn}
            onPress={() => onBookmarkPress(currentPage)}>
            <Text style={styles.bookmarkIcon}>
              {isBookmarked ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={initialPage - 1}
        onPageSelected={handlePageSelected}
        overdrag>
        {Array.from({ length: totalPages }, (_, i) => {
          const page = getPage(i + 1);
          return (
            <View key={i} style={styles.pageWrapper}>
              {page && page.verses.length > 0 ? (
                <PageContent page={page} />
              ) : (
                <View style={styles.emptyPage}>
                  <Text style={styles.emptyText}>Page {i + 1}</Text>
                </View>
              )}
            </View>
          );
        })}
      </PagerView>

      <View style={styles.swipeHint}>
        <Text style={styles.swipeHintText}>Swipe left or right to turn pages</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryDark,
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  navText: {
    color: colors.textOnPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  navDisabled: {
    opacity: 0.35,
  },
  pageIndicator: {
    alignItems: 'center',
  },
  pageNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.accent,
  },
  pageTotal: {
    fontSize: 12,
    color: colors.textOnPrimary,
    opacity: 0.7,
  },
  juzLabel: {
    fontSize: 11,
    color: colors.accentLight,
    marginTop: 2,
  },
  bookmarkBtn: {
    padding: 8,
  },
  bookmarkIcon: {
    fontSize: 22,
    color: colors.accent,
  },
  pager: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  pageWrapper: {
    flex: 1,
  },
  pageScroll: {
    flex: 1,
  },
  pageContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  surahNameAr: {
    fontSize: 28,
    color: colors.primary,
    fontFamily: typography.arabicLarge.fontFamily,
    marginBottom: 4,
  },
  surahNameEn: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  versesContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  verseInline: {
    ...typography.arabicMedium,
    color: colors.textArabic,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  ayahEnd: {
    color: colors.accent,
    fontSize: 16,
  },
  emptyPage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.textMuted,
  },
  swipeHint: {
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  swipeHintText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
