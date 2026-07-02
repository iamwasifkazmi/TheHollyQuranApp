import React, { useCallback, useEffect, useMemo, useState, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MushafPageView } from './MushafPageView';
import { PageReaderSkeleton } from './Skeleton';
import { useAppTheme } from '../context/SettingsContext';
import { getPage } from '../services/quranService';
import { scheduleIdleTask } from '../utils/idleCallback';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RENDER_WINDOW = 1;

interface MushafPagerProps {
  startPage: number;
  endPage: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
  showSwipeHint?: boolean;
  toolbarRight?: React.ReactNode;
  indicatorMode?: 'full' | 'range';
}

const LazyPage = memo(function LazyPage({
  pageNumber,
  currentPage,
}: {
  pageNumber: number;
  currentPage: number;
}) {
  const { settings } = useAppTheme();
  const inWindow = Math.abs(pageNumber - currentPage) <= RENDER_WINDOW;

  if (!inWindow) {
    return (
      <View
        style={[
          styles.pagePlaceholder,
          {
            backgroundColor: settings.darkMode ? '#1A1A1A' : '#F8F4E8',
          },
        ]}
      />
    );
  }

  return <MushafPageView pageNumber={pageNumber} />;
});

export function MushafPager({
  startPage,
  endPage,
  initialPage,
  onPageChange,
  showSwipeHint = true,
  toolbarRight,
  indicatorMode = 'range',
}: MushafPagerProps) {
  const { theme, settings } = useAppTheme();
  const pages = useMemo(() => {
    const list: number[] = [];
    for (let p = startPage; p <= endPage; p += 1) {
      list.push(p);
    }
    return list;
  }, [startPage, endPage]);

  const resolvedInitial = useMemo(() => {
    const target = initialPage ?? startPage;
    if (target < startPage) return startPage;
    if (target > endPage) return endPage;
    return target;
  }, [initialPage, startPage, endPage]);

  const initialIndex = Math.max(0, pages.indexOf(resolvedInitial));
  const [currentPage, setCurrentPage] = useState(resolvedInitial);
  const [pagerReady, setPagerReady] = useState(false);
  const pagerRef = React.useRef<PagerView>(null);

  useEffect(() => {
    return scheduleIdleTask(() => {
      setPagerReady(true);
    });
  }, []);

  useEffect(() => {
    if (resolvedInitial !== currentPage) {
      const index = pages.indexOf(resolvedInitial);
      if (index >= 0) {
        pagerRef.current?.setPageWithoutAnimation(index);
        setCurrentPage(resolvedInitial);
      }
    }
  }, [resolvedInitial, pages]);

  const handlePageSelected = useCallback(
    (e: { nativeEvent: { position: number } }) => {
      const page = pages[e.nativeEvent.position] ?? startPage;
      setCurrentPage(page);
      onPageChange?.(page);
    },
    [pages, startPage, onPageChange],
  );

  const goToIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(pages.length - 1, index));
    pagerRef.current?.setPage(clamped);
    const page = pages[clamped];
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const currentIndex = pages.indexOf(currentPage);
  const pageData = getPage(currentPage);
  const rangeTotal = pages.length;
  const totalMushafPages = 604;
  const canGoNext = currentIndex < pages.length - 1;
  const canGoPrev = currentIndex > 0;

  const pageTotalLabel =
    indicatorMode === 'full'
      ? `/ ${totalMushafPages}`
      : `${currentIndex + 1} / ${rangeTotal}${
          rangeTotal > 1 ? ` · pages ${startPage}–${endPage}` : ''
        }`;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.toolbar,
          {
            backgroundColor: theme.primary,
            borderBottomColor: theme.primaryDark,
          },
        ]}>
        {/* Arabic mushaf: left arrow advances to next page */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => goToIndex(currentIndex + 1)}
          disabled={!canGoNext}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Next page">
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={
              !canGoNext ? theme.textOnPrimary + '59' : theme.textOnPrimary
            }
          />
        </TouchableOpacity>

        <View style={styles.pageIndicator}>
          <Text style={[styles.pageNumber, { color: theme.accent }]}>
            {currentPage}
          </Text>
          <Text style={styles.pageTotal}>{pageTotalLabel}</Text>
          {pageData?.juzNumber ? (
            <Text style={styles.juzLabel}>Juz {pageData.juzNumber}</Text>
          ) : null}
        </View>

        {/* Arabic mushaf: right arrow goes to previous page */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => goToIndex(currentIndex - 1)}
          disabled={!canGoPrev}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Previous page">
          <MaterialCommunityIcons
            name="chevron-right"
            size={28}
            color={
              !canGoPrev ? theme.textOnPrimary + '59' : theme.textOnPrimary
            }
          />
        </TouchableOpacity>

        {toolbarRight ? (
          <View style={styles.toolbarRight}>{toolbarRight}</View>
        ) : null}
      </View>

      {!pagerReady ? (
        <PageReaderSkeleton />
      ) : (
        <PagerView
          ref={pagerRef}
          style={styles.pager}
          initialPage={initialIndex}
          onPageSelected={handlePageSelected}
          offscreenPageLimit={1}
          orientation="horizontal"
          layoutDirection="rtl"
          overdrag>
          {pages.map(pageNum => (
            <View key={pageNum} style={styles.pageWrapper} collapsable={false}>
              <LazyPage pageNumber={pageNum} currentPage={currentPage} />
            </View>
          ))}
        </PagerView>
      )}

      {showSwipeHint && settings.showSwipeHint ? (
        <View
          style={[
            styles.swipeHint,
            {
              backgroundColor: theme.surface,
              borderTopColor: theme.borderLight,
            },
          ]}>
          <Text style={[styles.swipeHintText, { color: theme.textMuted }]}>
            Swipe right to left for next page
          </Text>
        </View>
      ) : null}
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
    flex: 1,
  },
  pageNumber: {
    fontSize: 20,
    fontWeight: '700',
  },
  pageTotal: {
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.75,
    textAlign: 'center',
  },
  juzLabel: {
    fontSize: 11,
    color: '#E8C84A',
    marginTop: 2,
  },
  toolbarRight: {
    position: 'absolute',
    right: 8,
    top: '50%',
    marginTop: -20,
  },
  pager: {
    flex: 1,
    width: SCREEN_WIDTH,
    overflow: 'hidden',
  },
  pageWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  pagePlaceholder: {
    flex: 1,
  },
  swipeHint: {
    paddingVertical: 8,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  swipeHintText: {
    fontSize: 12,
  },
});
