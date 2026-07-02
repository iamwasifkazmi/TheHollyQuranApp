import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useAppTheme } from '../context/SettingsContext';

interface SettingSliderProps {
  label: string;
  subtitle?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  displayValue: string;
  onValueChange: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
}

export function SettingSlider({
  label,
  subtitle,
  value,
  min,
  max,
  step = 1,
  displayValue,
  onValueChange,
  onSlidingComplete,
}: SettingSliderProps) {
  const { theme } = useAppTheme();

  const handleChange = (v: number) => {
    const rounded = step < 1 ? Math.round(v * 10) / 10 : Math.round(v);
    onValueChange(rounded);
  };

  const handleComplete = (v: number) => {
    const rounded = step < 1 ? Math.round(v * 10) / 10 : Math.round(v);
    onSlidingComplete?.(rounded);
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.borderLight },
      ]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
        <Text style={[styles.value, { color: theme.accent }]}>{displayValue}</Text>
      </View>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {subtitle}
        </Text>
      )}
      <Slider
        style={styles.slider}
        value={value}
        minimumValue={min}
        maximumValue={max}
        step={step}
        onValueChange={handleChange}
        onSlidingComplete={handleComplete}
        minimumTrackTintColor={theme.primary}
        maximumTrackTintColor={theme.border}
        thumbTintColor={theme.accent}
      />
      <View style={styles.rangeRow}>
        <Text style={[styles.rangeText, { color: theme.textMuted }]}>{min}</Text>
        <Text style={[styles.rangeText, { color: theme.textMuted }]}>{max}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  slider: {
    width: '100%',
    height: 40,
    marginTop: 4,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
  },
  rangeText: {
    fontSize: 11,
  },
});
