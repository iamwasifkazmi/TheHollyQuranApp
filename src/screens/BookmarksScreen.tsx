import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getBookmarks, removeBookmark } from '../services/bookmarkService';
import { BookmarkTypeIcon, ChevronRight } from '../components/AppIcon';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import type { Bookmark, RootStackParamList } from '../types/quran';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export function BookmarksScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const load = useCallback(() => {
    getBookmarks().then(setBookmarks);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handlePress = (bookmark: Bookmark) => {
    switch (bookmark.type) {
      case 'surah':
        if (bookmark.surah) {
          navigation.navigate('SurahDetail', { surahId: bookmark.surah });
        }
        break;
      case 'page':
        if (bookmark.page) {
          navigation.navigate('Reader', { page: bookmark.page });
        }
        break;
      case 'juz':
        if (bookmark.juz) {
          navigation.navigate('JuzDetail', { juzNumber: bookmark.juz });
        }
        break;
      case 'verse':
        if (bookmark.surah && bookmark.ayah) {
          navigation.navigate('Reader', {
            surah: bookmark.surah,
            ayah: bookmark.ayah,
          });
        }
        break;
    }
  };

  const handleDelete = (bookmark: Bookmark) => {
    Alert.alert('Remove Bookmark', `Remove "${bookmark.label}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await removeBookmark(bookmark.id);
          load();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={styles.title}>Bookmarks</Text>
        <Text style={styles.subtitle}>
          {bookmarks.length} saved {bookmarks.length === 1 ? 'place' : 'places'}
        </Text>
      </View>

      {bookmarks.length === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons
            name="bookmark-outline"
            size={56}
            color={colors.textMuted}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>No bookmarks yet</Text>
          <Text style={styles.emptyText}>
            Bookmark surahs, pages, or juz while reading to find them quickly here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handlePress(item)}
              onLongPress={() => handleDelete(item)}
              activeOpacity={0.7}>
              <View style={styles.cardIcon}>
                <BookmarkTypeIcon type={item.type} size={28} color={colors.primary} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.label}</Text>
                {item.subtitle && (
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                )}
                <Text style={styles.cardType}>{item.type}</Text>
              </View>
              <ChevronRight size={24} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardIcon: {
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
  },
  cardSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardType: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'capitalize',
    marginTop: 4,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
