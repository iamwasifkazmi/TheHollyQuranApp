import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../context/SettingsContext';
import { SettingSlider } from '../components/SettingSlider';
import { typography } from '../theme/typography';
import { getTotalPages } from '../services/quranService';
import { getPageBackground } from '../services/settingsService';
import { toArabicNumeral } from '../utils/arabic';
import type { RootStackParamList } from '../types/quran';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

function SettingRow({
  label,
  subtitle,
  children,
}: {
  label: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const { theme } = useAppTheme();
  return (
    <View
      style={[
        styles.settingRow,
        { backgroundColor: theme.surface, borderColor: theme.borderLight },
      ]}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingLabel, { color: theme.text }]}>
          {label}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {children}
    </View>
  );
}

export function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { theme, settings, updateSetting, resetSettings, arabicFontSize } =
    useAppTheme();
  const totalPages = getTotalPages();
  const previewBg = getPageBackground(
    settings.pageBrightness,
    settings.darkMode,
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: insets.top },
      ]}>
      <StatusBar
        barStyle={settings.darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Customize your reading experience
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Appearance
        </Text>

        <SettingRow
          label="Dark Mode"
          subtitle="Easier on the eyes in low light">
          <Switch
            value={settings.darkMode}
            onValueChange={v => updateSetting('darkMode', v)}
            trackColor={{ false: theme.border, true: theme.primaryLight }}
            thumbColor={settings.darkMode ? theme.accent : '#f4f4f4'}
          />
        </SettingRow>

        <SettingSlider
          label="Page Brightness"
          subtitle="Adjust Mushaf page background brightness"
          value={settings.pageBrightness}
          min={20}
          max={100}
          step={5}
          displayValue={`${settings.pageBrightness}%`}
          onSlidingComplete={v => updateSetting('pageBrightness', v)}
          onValueChange={v => updateSetting('pageBrightness', v)}
        />

        <View
          style={[
            styles.previewBox,
            { backgroundColor: previewBg, borderColor: theme.border },
          ]}>
          <Text
            style={{
              fontSize: arabicFontSize,
              color: theme.textArabic,
              textAlign: 'right',
              writingDirection: 'rtl',
              fontFamily: typography.arabicMedium.fontFamily,
            }}>
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </Text>
          <View
            style={[styles.previewLine, { borderBottomColor: theme.divider }]}
          />
          <Text
            style={{
              fontSize: arabicFontSize,
              color: theme.textArabic,
              textAlign: 'right',
              writingDirection: 'rtl',
              fontFamily: typography.arabicMedium.fontFamily,
            }}>
            ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ ﴿{toArabicNumeral(2)}﴾
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Reading
        </Text>

        <SettingSlider
          label="Arabic Font Size"
          subtitle="Controls Quran text size across the app (20–50)"
          value={settings.arabicFontSize}
          min={20}
          max={50}
          step={1}
          displayValue={`${settings.arabicFontSize}px`}
          onSlidingComplete={v => updateSetting('arabicFontSize', v)}
          onValueChange={v => updateSetting('arabicFontSize', v)}
        />

        <SettingSlider
          label="Line Spacing"
          subtitle="Space between lines of Arabic text"
          value={settings.lineSpacing}
          min={1.2}
          max={2.5}
          step={0.1}
          displayValue={`${settings.lineSpacing.toFixed(1)}x`}
          onSlidingComplete={v => updateSetting('lineSpacing', v)}
          onValueChange={v => updateSetting('lineSpacing', v)}
        />

        <SettingSlider
          label="Preset Start Page"
          subtitle={
            settings.presetStartPage
              ? `Mushaf opens at page ${settings.presetStartPage}`
              : 'Set default page when opening Mushaf'
          }
          value={settings.presetStartPage ?? 1}
          min={1}
          max={totalPages}
          step={1}
          displayValue={`Page ${settings.presetStartPage ?? 1}`}
          onSlidingComplete={v => updateSetting('presetStartPage', v)}
          onValueChange={v => updateSetting('presetStartPage', v)}
        />

        <SettingRow
          label="Prefer Last Read"
          subtitle="Continue from last page instead of preset when opening Mushaf">
          <Switch
            value={settings.preferLastRead}
            onValueChange={v => updateSetting('preferLastRead', v)}
            trackColor={{ false: theme.border, true: theme.primaryLight }}
            thumbColor={settings.preferLastRead ? theme.accent : '#f4f4f4'}
          />
        </SettingRow>

        <SettingRow
          label="Show Swipe Hint"
          subtitle="Display page-turn hint in Mushaf reader">
          <Switch
            value={settings.showSwipeHint}
            onValueChange={v => updateSetting('showSwipeHint', v)}
            trackColor={{ false: theme.border, true: theme.primaryLight }}
            thumbColor={settings.showSwipeHint ? theme.accent : '#f4f4f4'}
          />
        </SettingRow>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Navigation
        </Text>

        <TouchableOpacity
          style={[
            styles.linkRow,
            { backgroundColor: theme.surface, borderColor: theme.borderLight },
          ]}
          onPress={() => navigation.navigate('PageJump')}>
          <Text style={[styles.settingLabel, { color: theme.text }]}>
            Go to Page
          </Text>
          <Text style={{ color: theme.primary }}>Open ›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.resetBtn, { borderColor: theme.error }]}
          onPress={resetSettings}>
          <Text style={{ color: theme.error, fontWeight: '600' }}>
            Reset All Settings
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    ...typography.h1,
  },
  subtitle: {
    ...typography.bodySmall,
    marginTop: 4,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: 12,
    marginTop: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    ...typography.h3,
    fontSize: 16,
  },
  settingSubtitle: {
    ...typography.caption,
    marginTop: 4,
    lineHeight: 18,
  },
  previewBox: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  previewLine: {
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  resetBtn: {
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
});
