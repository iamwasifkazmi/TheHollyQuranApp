import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';

const ARABIC_NUMERAL_RE = /[\u0660-\u0669]+/g;

interface MushafLineTextProps {
  text: string;
  style?: StyleProp<TextStyle>;
  ayahColor: string;
  numberOfLines?: number;
  adjustsFontSizeToFit?: boolean;
  minimumFontScale?: number;
}

export function MushafLineText({
  text,
  style,
  ayahColor,
  numberOfLines,
  adjustsFontSizeToFit,
  minimumFontScale,
}: MushafLineTextProps) {
  const parts = text.split(ARABIC_NUMERAL_RE);
  const matches = text.match(ARABIC_NUMERAL_RE) ?? [];

  if (matches.length === 0) {
    return (
      <Text
        style={style}
        numberOfLines={numberOfLines}
        adjustsFontSizeToFit={adjustsFontSizeToFit}
        minimumFontScale={minimumFontScale}
        allowFontScaling={false}>
        {text}
      </Text>
    );
  }

  const nodes: React.ReactNode[] = [];
  parts.forEach((part, index) => {
    if (part) {
      nodes.push(<Text key={`t-${index}`}>{part}</Text>);
    }
    const num = matches[index];
    if (num) {
      nodes.push(
        <Text key={`n-${index}`} style={[styles.ayahNumber, { color: ayahColor }]}>
          {' ﴿'}
          {num}
          {'﴾'}
        </Text>,
      );
    }
  });

  return (
    <Text
      style={style}
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
      allowFontScaling={false}>
      {nodes}
    </Text>
  );
}

const styles = StyleSheet.create({
  ayahNumber: {
    fontWeight: '700',
    fontSize: 17,
  },
});
