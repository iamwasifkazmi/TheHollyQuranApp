import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SurahCard } from '../components/SurahCard';
import { SearchBar } from '../components/SearchBar';
import { VerseListSkeleton } from '../components/Skeleton';
import { getChapters, searchChapters } from '../services/quranService';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import type { RootStackParamList } from '../types/quran';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export function SurahsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [navigatingTo, setNavigatingTo] = useState<number | null>(null);
  const chapters = useMemo(
    () => (query ? searchChapters(query) : getChapters()),
    [query],
  );

  useFocusEffect(
    useCallback(() => {
      setNavigatingTo(null);
    }, []),
  );

  const openSurah = useCallback(
    (surahId: number) => {
      setNavigatingTo(surahId);
      navigation.navigate('SurahDetail', { surahId });
    },
    [navigation],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={styles.title}>Surahs</Text>
        <Text style={styles.subtitle}>114 Chapters</Text>
      </View>
      <View style={styles.listContainer}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search surah by name or number..."
        />
        {navigatingTo !== null ? (
          <VerseListSkeleton rows={8} />
        ) : (
          <FlatList
            data={chapters}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <SurahCard
                number={item.id}
                name={item.name}
                nameArabic={item.nameArabic}
                nameTranslation={item.nameTranslation}
                versesCount={item.versesCount}
                revelationPlace={item.revelationPlace}
                onPress={() => openSurah(item.id)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            initialNumToRender={15}
            maxToRenderPerBatch={20}
            windowSize={10}
          />
        )}
      </View>
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
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  list: {
    paddingBottom: 24,
  },
});
