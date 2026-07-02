import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getTotalPages } from '../services/quranService';
import { useAppTheme } from '../context/SettingsContext';
import { typography } from '../theme/typography';
import { ChevronLeft } from '../components/AppIcon';
import { SurahPicker } from '../components/SurahPicker';
import type { Chapter } from '../types/quran';
import type { RootStackParamList } from '../types/quran';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PageJump'>;
};

function GoButton({ onPress, theme }: { onPress: () => void; theme: ReturnType<typeof useAppTheme>['theme'] }) {
  return (
    <TouchableOpacity
      style={[styles.goBtn, { backgroundColor: theme.primary }]}
      onPress={onPress}
      activeOpacity={0.8}>
      <Text style={[styles.goBtnText, { color: theme.accent }]}>Go</Text>
    </TouchableOpacity>
  );
}

export function PageJumpScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const [pageInput, setPageInput] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<Chapter | null>(null);
  const [ayahInput, setAyahInput] = useState('');
  const totalPages = getTotalPages();

  const goToPage = () => {
    const page = parseInt(pageInput, 10);
    if (page >= 1 && page <= totalPages) {
      navigation.replace('Reader', { page });
    }
  };

  const goToSurahAyah = () => {
    if (!selectedSurah) return;
    const ayah = parseInt(ayahInput, 10) || 1;
    navigation.replace('Reader', { surah: selectedSurah.id, ayah });
  };

  const quickPages = [1, 2, 50, 100, 200, 300, 400, 500, 604];

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: insets.top },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ChevronLeft size={28} color={theme.accentLight} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.textOnPrimary }]}>
          Go to Page
        </Text>
        <Text style={[styles.subtitle, { color: theme.textOnPrimary }]}>
          Navigate to any page or verse
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionLabel, { color: theme.text }]}>
          Page Number (1–{totalPages})
        </Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            value={pageInput}
            onChangeText={setPageInput}
            placeholder={`Enter page 1–${totalPages}`}
            placeholderTextColor={theme.textMuted}
            keyboardType="number-pad"
            maxLength={3}
          />
          <GoButton onPress={goToPage} theme={theme} />
        </View>

        <Text style={[styles.quickLabel, { color: theme.textSecondary }]}>
          Quick jump
        </Text>
        <View style={styles.quickGrid}>
          {quickPages.map(p => (
            <TouchableOpacity
              key={p}
              style={[
                styles.quickBtn,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => navigation.replace('Reader', { page: p })}>
              <Text style={[styles.quickBtnText, { color: theme.primary }]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.divider, { backgroundColor: theme.divider }]} />

        <Text style={[styles.sectionLabel, { color: theme.text }]}>
          Surah & Ayah
        </Text>
        <View style={styles.surahSection}>
          <SurahPicker
            selectedId={selectedSurah?.id ?? null}
            onSelect={setSelectedSurah}
          />
        </View>
        <View style={styles.surahRow}>
          <Text style={[styles.colon, { color: theme.textSecondary }]}>Ayah</Text>
          <TextInput
            style={[
              styles.ayahInput,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            value={ayahInput}
            onChangeText={setAyahInput}
            placeholder="1"
            placeholderTextColor={theme.textMuted}
            keyboardType="number-pad"
            maxLength={3}
          />
          <GoButton onPress={goToSurahAyah} theme={theme} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 4,
  },
  backBtn: {
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  title: {
    ...typography.h1,
  },
  subtitle: {
    ...typography.bodySmall,
    opacity: 0.75,
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    ...typography.h3,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    borderWidth: 1,
    minHeight: 52,
  },
  goBtn: {
    borderRadius: 12,
    paddingHorizontal: 22,
    minHeight: 52,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  quickLabel: {
    ...typography.bodySmall,
    marginBottom: 10,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  quickBtn: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
  },
  quickBtnText: {
    fontWeight: '600',
    fontSize: 15,
  },
  divider: {
    height: 1,
    marginBottom: 24,
  },
  surahSection: {
    marginBottom: 12,
  },
  surahRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  colon: {
    fontSize: 15,
    fontWeight: '600',
    width: 40,
  },
  ayahInput: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    borderWidth: 1,
    minHeight: 52,
    maxWidth: 100,
  },
});
