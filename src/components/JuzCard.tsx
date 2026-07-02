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

interface JuzCardProps {
  number: number;
  onPress: () => void;
  style?: ViewStyle;
}

const JUZ_NAMES: Record<number, string> = {
  1: 'Alif Lam Meem',
  2: 'Sayaqool',
  3: 'Tilkal Rusul',
  4: 'Lan Tanaloo',
  5: 'Wal Muhsanat',
  6: 'La Yuhibbullah',
  7: 'Wa Iza Sami\'oo',
  8: 'Wa Lau Annana',
  9: 'Qalal Mala',
  10: 'Wa A\'lamu',
  11: 'Yatazeroon',
  12: 'Wa Mamin Da\'abba',
  13: 'Wa Ma Ubarri\'oo',
  14: 'Rubama',
  15: 'Subhanallazi',
  16: 'Qal Alam',
  17: 'Aqtaraba',
  18: 'Qad Aflaha',
  19: 'Wa Qalallazina',
  20: 'A\'man Khalaq',
  21: 'Utlu Ma Oohi',
  22: 'Wa Manyaqnut',
  23: 'Wa Mali',
  24: 'Faman Azlam',
  25: 'Ilayhi Yuradd',
  26: 'Ha\'a Meem',
  27: 'Qala Fama Khatbukum',
  28: 'Qad Sami\'allahu',
  29: 'Tabarakallazi',
  30: 'Amma Yatasa\'aloon',
};

export function JuzCard({ number, onPress, style }: JuzCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.numberCircle}>
        <Text style={styles.numberText}>{number}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Juz {number}</Text>
        <Text style={styles.subtitle}>{JUZ_NAMES[number] ?? `Para ${number}`}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
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
  numberCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  numberText: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.h3,
    color: colors.text,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  arrow: {
    fontSize: 24,
    color: colors.textMuted,
    fontWeight: '300',
  },
});
