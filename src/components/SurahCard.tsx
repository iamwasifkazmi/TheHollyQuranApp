import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface SurahCardProps {
  number: number;
  name: string;
  nameArabic: string;
  nameTranslation: string;
  versesCount: number;
  revelationPlace: string;
  onPress: () => void;
  style?: ViewStyle;
}

export function SurahCard({
  number,
  name,
  nameArabic,
  nameTranslation,
  versesCount,
  revelationPlace,
  onPress,
  style,
}: SurahCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{number}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.nameArabic}>{nameArabic}</Text>
        </View>
        <Text style={styles.translation}>{nameTranslation}</Text>
        <Text style={styles.meta}>
          {versesCount} verses · {revelationPlace === 'makkah' ? 'Makkah' : 'Madinah'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  numberBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  numberText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
  },
  nameArabic: {
    fontSize: 20,
    color: colors.textArabic,
    fontFamily: typography.arabicMedium.fontFamily,
  },
  translation: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
