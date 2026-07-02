import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JuzCard } from '../components/JuzCard';
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={styles.title}>Juz / Para</Text>
        <Text style={styles.subtitle}>30 Parts of the Quran</Text>
      </View>
      <FlatList
        data={juzs}
        keyExtractor={item => String(item.juzNumber)}
        renderItem={({ item }) => (
          <JuzCard
            number={item.juzNumber}
            onPress={() =>
              navigation.navigate('JuzDetail', { juzNumber: item.juzNumber })
            }
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
