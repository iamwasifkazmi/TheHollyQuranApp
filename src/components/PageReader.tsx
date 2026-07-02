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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BookmarkIcon } from './AppIcon';
import { useAppTheme } from '../context/SettingsContext';
import { typography } from '../theme/typography';
import { getTotalPages, getPage } from '../services/quranService';
import { saveLastRead } from '../services/bookmarkService';
import { getPageBackground } from '../services/settingsService';
import { toArabicNumeral } from '../utils/arabic';
import type { Page } from '../types/quran';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PageReaderProps {
  initialPage?: number;
  onPageChange?: (page: number) => void;
  onBookmarkPress?: (page: number) => void;
  isBookmarked?: boolean;
}

function PageContent({ page, pageNumber }: { page: Page; pageNumber: number }) {
  const { theme, settings, arabicFontSize, arabicLineHeight } = useAppTheme();
  const chapterInfo = page.chapters[0];
  const pageBg = getPageBackground(settings.pageBrightness, settings.darkMode);

  return (
    <ScrollView
      style={[styles.pageScroll, { backgroundColor: pageBg }]}
      contentContainerStyle={styles.pageContent}
      showsVerticalScrollIndicator={false}>
      {chapterInfo && (
        <View style={[styles.header, { borderBottomColor: theme.divider }]}>
          <Text
            style={[
              styles.surahNameAr,
              { color: theme.primary, fontSize: arabicFontSize + 6 },
            ]}>
            {chapterInfo.nameAr}
          </Text>
          <Text style={[styles.surahNameEn, { color: theme.textSecondary }]}>
            {chapterInfo.nameEn} · Page {pageNumber}
          </Text>
        </View>
      )}
      <View style={styles.versesContainer}>
        {page.verses.map((verse, idx) => (
          <View
            key={`${verse.key}-${idx}`}
            style={[styles.verseRow, { borderBottomColor: theme.divider }]}>
            <Text
              style={[
                styles.verseText,
                {
                  color: theme.textArabic,
                  fontSize: arabicFontSize,
                  lineHeight: arabicLineHeight,
                },
              ]}>
              {verse.text}
              <Text style={[styles.ayahEnd, { color: theme.accent }]}>
                {' '}
                ﴿{toArabicNumeral(verse.ayah)}﴾
              </Text>
            </Text>
          </View>
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
  const { theme, settings } = useAppTheme();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const pagerRef = React.useRef<PagerView>(null);
  const totalPages = getTotalPages();

  useEffect(() => {
    if (initialPage !== currentPage) {
      pagerRef.current?.setPageWithoutAnimation(initialPage - 1);
      setCurrentPage(initialPage);
    }
  }, [initialPage, currentPage]);

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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.toolbar,
          {
            backgroundColor: theme.primary,
            borderBottomColor: theme.primaryDark,
          },
        ]}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={
              currentPage <= 1
                ? theme.textOnPrimary + '59'
                : theme.textOnPrimary
            }
          />
        </TouchableOpacity>

        <View style={styles.pageIndicator}>
          <Text style={[styles.pageNumber, { color: theme.accent }]}>
            {currentPage}
          </Text>
          <Text style={styles.pageTotal}>/ {totalPages}</Text>
          {pageData?.juzNumber && (
            <Text style={styles.juzLabel}>Juz {pageData.juzNumber}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialCommunityIcons
            name="chevron-right"
            size={28}
            color={
              currentPage >= totalPages
                ? theme.textOnPrimary + '59'
                : theme.textOnPrimary
            }
          />
        </TouchableOpacity>

        {onBookmarkPress && (
          <TouchableOpacity
            style={styles.bookmarkBtn}
            onPress={() => onBookmarkPress(currentPage)}>
            <BookmarkIcon
              active={isBookmarked}
              size={24}
              color={theme.accent}
            />
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
                <PageContent page={page} pageNumber={i + 1} />
              ) : (
                <View
                  style={[
                    styles.emptyPage,
                    {
                      backgroundColor: getPageBackground(
                        settings.pageBrightness,
                        settings.darkMode,
                      ),
                    },
                  ]}>
                  <Text style={{ color: theme.textMuted }}>Page {i + 1}</Text>
                </View>
              )}
            </View>
          );
        })}
      </PagerView>

      {settings.showSwipeHint && (
        <View
          style={[
            styles.swipeHint,
            {
              backgroundColor: theme.surface,
              borderTopColor: theme.borderLight,
            },
          ]}>
          <Text style={[styles.swipeHintText, { color: theme.textMuted }]}>
            Swipe left or right to turn pages
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  navButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pageIndicator: {
    alignItems: 'center',
  },
  pageNumber: {
    fontSize: 20,
    fontWeight: '700',
  },
  pageTotal: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  juzLabel: {
    fontSize: 11,
    color: '#E8C84A',
    marginTop: 2,
  },
  bookmarkBtn: {
    padding: 8,
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  surahNameAr: {
    fontFamily: typography.arabicLarge.fontFamily,
    marginBottom: 4,
    textAlign: 'center',
  },
  surahNameEn: {
    ...typography.bodySmall,
  },
  versesContainer: {},
  verseRow: {
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  verseText: {
    textAlign: 'right',
    writingDirection: 'rtl',
    fontFamily: typography.arabicMedium.fontFamily,
  },
  ayahEnd: {
    fontSize: 16,
  },
  emptyPage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeHint: {
    paddingVertical: 8,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  swipeHintText: {
    ...typography.caption,
  },
});
