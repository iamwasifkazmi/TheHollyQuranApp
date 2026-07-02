import React, { useCallback, useState } from 'react';
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
import { JuzCard } from '../components/JuzCard';
import { VerseListSkeleton } from '../components/Skeleton';
import { getJuzs } from '../services/quranService';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import type { RootStackParamList } from '../types/quran';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export function JuzScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const juzs = getJuzs();
  const [navigatingTo, setNavigatingTo] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      setNavigatingTo(null);
    }, []),
  );

  const openJuz = useCallback(
    (juzNumber: number) => {
      setNavigatingTo(juzNumber);
      navigation.navigate('JuzDetail', { juzNumber });
    },
    [navigation],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={styles.title}>Juz / Para</Text>
        <Text style={styles.subtitle}>30 Parts of the Quran</Text>
      </View>
      {navigatingTo !== null ? (
        <VerseListSkeleton rows={8} />
      ) : (
        <FlatList
          data={juzs}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <JuzCard
              number={item.juzNumber}
              onPress={() => openJuz(item.juzNumber)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          initialNumToRender={15}
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
});
