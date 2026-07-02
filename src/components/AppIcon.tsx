import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';
import type { BookmarkType } from '../types/quran';

type IconFamily = 'material' | 'ionicon';

interface IconProps {
  name: string;
  family?: IconFamily;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function Icon({
  name,
  family = 'material',
  size = 24,
  color = colors.text,
  style,
}: IconProps) {
  const Component = family === 'ionicon' ? Ionicons : MaterialCommunityIcons;
  return <Component name={name} size={size} color={color} style={style} />;
}

export function BookmarkIcon({
  active,
  size = 24,
  color = colors.accent,
}: {
  active: boolean;
  size?: number;
  color?: string;
}) {
  return (
    <MaterialCommunityIcons
      name={active ? 'bookmark' : 'bookmark-outline'}
      size={size}
      color={color}
    />
  );
}

export function ChevronRight({
  size = 24,
  color = colors.textMuted,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <MaterialCommunityIcons
      name="chevron-right"
      size={size}
      color={color}
    />
  );
}

export function ChevronLeft({
  size = 20,
  color = colors.accentLight,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <MaterialCommunityIcons name="chevron-left" size={size} color={color} />
  );
}

const TAB_ICONS: Record<string, { name: string; activeName: string }> = {
  Home: { name: 'home-outline', activeName: 'home' },
  Surahs: { name: 'book-open-variant', activeName: 'book-open' },
  Juz: { name: 'book-multiple-outline', activeName: 'book-multiple' },
  Bookmarks: { name: 'bookmark-outline', activeName: 'bookmark' },
};

export function TabBarIcon({
  routeName,
  focused,
  color,
  size = 24,
}: {
  routeName: string;
  focused: boolean;
  color: string;
  size?: number;
}) {
  const config = TAB_ICONS[routeName];
  if (!config) {
    return <MaterialCommunityIcons name="circle" size={size} color={color} />;
  }
  return (
    <MaterialCommunityIcons
      name={focused ? config.activeName : config.name}
      size={size}
      color={color}
    />
  );
}

const BOOKMARK_TYPE_ICONS: Record<BookmarkType, string> = {
  surah: 'book-open-variant',
  page: 'book-open-page-variant',
  juz: 'book-multiple',
  verse: 'map-marker-outline',
};

export function BookmarkTypeIcon({
  type,
  size = 28,
  color = colors.primary,
}: {
  type: BookmarkType;
  size?: number;
  color?: string;
}) {
  return (
    <MaterialCommunityIcons
      name={BOOKMARK_TYPE_ICONS[type] ?? 'bookmark-outline'}
      size={size}
      color={color}
    />
  );
}

export const QuickActionIcons = {
  mushaf: 'book-open-page-variant',
  surahs: 'format-list-bulleted',
  juz: 'book-multiple',
  bookmarks: 'bookmark-outline',
  pageJump: 'numeric',
  continueReading: 'book-open-variant',
} as const;
