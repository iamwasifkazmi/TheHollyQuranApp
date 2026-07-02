import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Pressable,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppTheme } from '../context/SettingsContext';
import { getChapters, searchChapters } from '../services/quranService';
import type { Chapter } from '../types/quran';

interface SurahPickerProps {
  selectedId: number | null;
  onSelect: (chapter: Chapter) => void;
}

export function SurahPicker({ selectedId, onSelect }: SurahPickerProps) {
  const { theme } = useAppTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const chapters = useMemo(
    () => (query ? searchChapters(query) : getChapters()),
    [query],
  );
  const selected = selectedId
    ? getChapters().find(c => c.id === selectedId)
    : null;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.trigger,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}>
        <View style={styles.triggerContent}>
          {selected ? (
            <>
              <Text style={[styles.triggerTitle, { color: theme.text }]}>
                {selected.id}. {selected.name}
              </Text>
              <Text style={[styles.triggerArabic, { color: theme.textArabic }]}>
                {selected.nameArabic}
              </Text>
            </>
          ) : (
            <Text style={[styles.placeholder, { color: theme.textMuted }]}>
              Select Surah
            </Text>
          )}
        </View>
        <MaterialCommunityIcons
          name="chevron-down"
          size={22}
          color={theme.textMuted}
        />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable
            style={[
              styles.sheet,
              { backgroundColor: theme.surface },
            ]}
            onPress={e => e.stopPropagation()}>
            <View style={[styles.sheetHeader, { borderBottomColor: theme.divider }]}>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>
                Select Surah
              </Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={theme.textMuted}
                />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[
                styles.search,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="Search surah..."
              placeholderTextColor={theme.textMuted}
              value={query}
              onChangeText={setQuery}
            />
            <FlatList
              data={chapters}
              keyExtractor={item => String(item.id)}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.item,
                    {
                      backgroundColor:
                        item.id === selectedId ? theme.primary + '18' : 'transparent',
                      borderBottomColor: theme.divider,
                    },
                  ]}
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                    setQuery('');
                  }}>
                  <View
                    style={[
                      styles.itemBadge,
                      { backgroundColor: theme.primary + '22' },
                    ]}>
                    <Text style={[styles.itemNum, { color: theme.accent }]}>
                      {item.id}
                    </Text>
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, { color: theme.text }]}>
                      {item.name}
                    </Text>
                    <Text
                      style={[styles.itemTranslation, { color: theme.textSecondary }]}>
                      {item.nameTranslation}
                    </Text>
                  </View>
                  <Text style={[styles.itemArabic, { color: theme.textArabic }]}>
                    {item.nameArabic}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 52,
  },
  triggerContent: {
    flex: 1,
  },
  triggerTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  triggerArabic: {
    fontSize: 14,
    marginTop: 2,
  },
  placeholder: {
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '75%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  search: {
    margin: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemNum: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemTranslation: {
    fontSize: 12,
    marginTop: 2,
  },
  itemArabic: {
    fontSize: 16,
    marginLeft: 8,
  },
});
