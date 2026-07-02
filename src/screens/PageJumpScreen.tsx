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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getTotalPages } from '../services/quranService';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { ChevronLeft } from '../components/AppIcon';
import type { RootStackParamList } from '../types/quran';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PageJump'>;
};

export function PageJumpScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [pageInput, setPageInput] = useState('');
  const [surahInput, setSurahInput] = useState('');
  const [ayahInput, setAyahInput] = useState('');
  const totalPages = getTotalPages();

  const goToPage = () => {
    const page = parseInt(pageInput, 10);
    if (page >= 1 && page <= totalPages) {
      navigation.replace('Reader', { page });
    }
  };

  const goToSurahAyah = () => {
    const surah = parseInt(surahInput, 10);
    const ayah = parseInt(ayahInput, 10) || 1;
    if (surah >= 1 && surah <= 114) {
      navigation.replace('Reader', { surah, ayah });
    }
  };

  const quickPages = [1, 2, 50, 100, 200, 300, 400, 500, 604];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <View style={styles.backRow}>
            <ChevronLeft size={22} color={colors.accentLight} />
            <Text style={styles.backText}>Back</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.title}>Go to Page</Text>
        <Text style={styles.subtitle}>Navigate to any page or verse</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionLabel}>Page Number (1–{totalPages})</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={pageInput}
            onChangeText={setPageInput}
            placeholder={`Enter page 1–${totalPages}`}
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            maxLength={3}
          />
          <TouchableOpacity style={styles.goBtn} onPress={goToPage}>
            <Text style={styles.goBtnText}>Go</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.quickLabel}>Quick jump</Text>
        <View style={styles.quickGrid}>
          {quickPages.map(p => (
            <TouchableOpacity
              key={p}
              style={styles.quickBtn}
              onPress={() => navigation.replace('Reader', { page: p })}>
              <Text style={styles.quickBtnText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>Surah & Ayah</Text>
        <View style={styles.surahRow}>
          <TextInput
            style={[styles.input, styles.surahInput]}
            value={surahInput}
            onChangeText={setSurahInput}
            placeholder="Surah (1–114)"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            maxLength={3}
          />
          <Text style={styles.colon}>:</Text>
          <TextInput
            style={[styles.input, styles.surahInput]}
            value={ayahInput}
            onChangeText={setAyahInput}
            placeholder="Ayah"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            maxLength={3}
          />
          <TouchableOpacity style={styles.goBtn} onPress={goToSurahAyah}>
            <Text style={styles.goBtnText}>Go</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
  },
  backBtn: {
    marginBottom: 12,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  backText: {
    color: colors.accentLight,
    fontSize: 16,
  },
  title: {
    ...typography.h1,
    color: colors.textOnPrimary,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textOnPrimary,
    opacity: 0.75,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionLabel: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  goBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  goBtnText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  quickLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  quickBtn: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickBtnText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: 24,
  },
  surahRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  surahInput: {
    flex: 1,
  },
  colon: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
