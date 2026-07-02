import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ViewStyle,
  StyleProp,
  DimensionValue,
} from 'react-native';
import { useAppTheme } from '../context/SettingsContext';
import { getPageBackground } from '../services/settingsService';

interface SkeletonBoxProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function SkeletonBox({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}: SkeletonBoxProps) {
  const { theme } = useAppTheme();
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.border,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function PageReaderSkeleton() {
  const { theme, settings } = useAppTheme();
  const bg = getPageBackground(settings.pageBrightness, settings.darkMode);

  return (
    <View style={[styles.pageSkeleton, { backgroundColor: bg }]}>
      <View style={styles.pageSkeletonInner}>
        {Array.from({ length: 15 }, (_, i) => (
          <View
            key={i}
            style={[styles.lineSkeletonRow, { borderBottomColor: theme.divider }]}>
            <SkeletonBox
              height={i === 0 ? 20 : 14}
              width={i === 0 ? '55%' : `${50 + (i % 4) * 12}%`}
              style={styles.centered}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

export function VerseListSkeleton({ rows = 10 }: { rows?: number }) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.verseListSkeleton, { backgroundColor: theme.background }]}>
      {Array.from({ length: rows }, (_, i) => (
        <View
          key={i}
          style={[styles.verseSkeletonItem, { borderBottomColor: theme.divider }]}>
          <SkeletonBox height={36} width={36} borderRadius={18} />
          <View style={styles.verseSkeletonText}>
            <SkeletonBox height={16} width="95%" />
            <SkeletonBox height={16} width="75%" style={{ marginTop: 6 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function SurahHeaderSkeleton() {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.surahHeaderSkeleton, { backgroundColor: theme.primary }]}>
      <SkeletonBox height={32} width="50%" style={styles.centered} />
      <SkeletonBox height={18} width="70%" style={[styles.centered, { marginTop: 10 }]} />
      <SkeletonBox height={14} width="55%" style={[styles.centered, { marginTop: 8 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  pageSkeleton: {
    flex: 1,
    overflow: 'hidden',
  },
  pageSkeletonInner: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  centered: {
    alignSelf: 'center',
  },
  lineSkeletonRow: {
    flex: 1,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 4,
  },
  verseListSkeleton: {
    flex: 1,
    padding: 16,
  },
  verseSkeletonItem: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  verseSkeletonText: {
    flex: 1,
  },
  surahHeaderSkeleton: {
    padding: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
});
