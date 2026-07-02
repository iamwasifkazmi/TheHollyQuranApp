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
import { useAppTheme } from '../context/SettingsContext';
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
  const { theme } = useAppTheme();
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
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: theme.background },
      ]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={styles.bismillah}>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</Text>
        <Text style={styles.title}>The Holy Quran</Text>
        <Text style={styles.subtitle}>القرآن الكريم</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            styles.continueCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.accent,
            },
          ]}
          onPress={continueReading}>
          <View style={[styles.continueIcon, { backgroundColor: theme.primary }]}>
            <Icon
              name={QuickActionIcons.continueReading}
              size={26}
              color={theme.accent}
            />
          </View>
          <View style={styles.continueInfo}>
            <Text style={[styles.continueTitle, { color: theme.text }]}>
              Continue Reading
            </Text>
            <Text style={[styles.continueSubtitle, { color: theme.textSecondary }]}>
              Page {lastPage} of 604
            </Text>
          </View>
          <ChevronRight size={28} color={theme.primary} />
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Quick Access
        </Text>

        <View style={styles.grid}>
          <QuickAction
            icon={QuickActionIcons.mushaf}
            title="Mushaf"
            subtitle="Swipe pages"
            onPress={() => navigation.navigate('Reader', {})}
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

        <View style={[styles.infoCard, { backgroundColor: theme.primaryDark }]}>
          <Text style={[styles.infoTitle, { color: theme.accent }]}>
            Offline & Authentic
          </Text>
          <Text style={[styles.infoText, { color: theme.textOnPrimary }]}>
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
  const { theme } = useAppTheme();
  return (
    <TouchableOpacity
      style={[
        styles.actionCard,
        {
          backgroundColor: theme.surface,
          borderColor: theme.borderLight,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Icon name={icon} size={28} color={theme.primary} style={styles.actionIcon} />
      <Text style={[styles.actionTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.actionSubtitle, { color: theme.textMuted }]}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  continueIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  continueInfo: {
    flex: 1,
  },
  continueTitle: {
    ...typography.h3,
  },
  continueSubtitle: {
    ...typography.bodySmall,
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.h3,
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
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#0D4A3E14',
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
  },
  actionSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  infoCard: {
    borderRadius: 16,
    padding: 18,
  },
  infoTitle: {
    ...typography.h3,
    marginBottom: 8,
  },
  infoText: {
    ...typography.bodySmall,
    opacity: 0.85,
    lineHeight: 20,
  },
});
