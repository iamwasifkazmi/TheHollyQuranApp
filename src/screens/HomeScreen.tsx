import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { getLastRead } from '../services/bookmarkService';
import { Icon, QuickActionIcons, ChevronRight } from '../components/AppIcon';
import type { RootStackParamList } from '../types/quran';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [lastPage, setLastPage] = useState(1);

  useFocusEffect(
    useCallback(() => {
      getLastRead().then(setLastPage);
    }, []),
  );

  const continueReading = useCallback(() => {
    navigation.navigate('Reader', { page: lastPage });
  }, [navigation, lastPage]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.header}>
        <Text style={styles.bismillah}>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</Text>
        <Text style={styles.title}>The Holy Quran</Text>
        <Text style={styles.subtitle}>القرآن الكريم</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.continueCard} onPress={continueReading}>
          <View style={styles.continueIcon}>
            <Icon
              name={QuickActionIcons.continueReading}
              size={26}
              color={colors.accent}
            />
          </View>
          <View style={styles.continueInfo}>
            <Text style={styles.continueTitle}>Continue Reading</Text>
            <Text style={styles.continueSubtitle}>Page {lastPage} of 604</Text>
          </View>
          <ChevronRight size={28} color={colors.primary} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Quick Access</Text>

        <View style={styles.grid}>
          <QuickAction
            icon={QuickActionIcons.mushaf}
            title="Mushaf"
            subtitle="Swipe pages"
            onPress={() => navigation.navigate('Reader', { page: 1 })}
          />
          <QuickAction
            icon={QuickActionIcons.surahs}
            title="Surahs"
            subtitle="114 chapters"
            onPress={() => navigation.navigate('MainTabs', { screen: 'Surahs' } as never)}
          />
          <QuickAction
            icon={QuickActionIcons.juz}
            title="Juz / Para"
            subtitle="30 parts"
            onPress={() => navigation.navigate('MainTabs', { screen: 'Juz' } as never)}
          />
          <QuickAction
            icon={QuickActionIcons.bookmarks}
            title="Bookmarks"
            subtitle="Saved places"
            onPress={() => navigation.navigate('MainTabs', { screen: 'Bookmarks' } as never)}
          />
          <QuickAction
            icon={QuickActionIcons.pageJump}
            title="Go to Page"
            subtitle="Jump to page"
            onPress={() => navigation.navigate('PageJump')}
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Offline & Authentic</Text>
          <Text style={styles.infoText}>
            Uthmani script from Tanzil Project · Madani Mushaf page layout ·
            Quran.com metadata · Works fully offline
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function QuickAction({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.7}>
      <Icon name={icon} size={28} color={colors.primary} style={styles.actionIcon} />
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 16,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  bismillah: {
    fontSize: 18,
    color: colors.accentLight,
    fontFamily: typography.arabicMedium.fontFamily,
    marginBottom: 12,
    textAlign: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textOnPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 20,
    color: colors.accent,
    fontFamily: typography.arabicMedium.fontFamily,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 20,
    paddingBottom: 40,
  },
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.accent,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  continueIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  continueInfo: {
    flex: 1,
  },
  continueTitle: {
    ...typography.h3,
    color: colors.text,
  },
  continueSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    marginBottom: 8,
  },
  actionTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.text,
  },
  actionSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 16,
    padding: 18,
  },
  infoTitle: {
    ...typography.h3,
    color: colors.accent,
    marginBottom: 8,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.textOnPrimary,
    opacity: 0.85,
    lineHeight: 20,
  },
});
