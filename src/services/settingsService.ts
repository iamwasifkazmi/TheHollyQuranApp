import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@quran_app_settings';

export interface AppSettings {
  darkMode: boolean;
  pageBrightness: number;
  presetStartPage: number | null;
  arabicFontSize: number;
  lineSpacing: number;
  showSwipeHint: boolean;
  preferLastRead: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  pageBrightness: 70,
  presetStartPage: null,
  arabicFontSize: 20,
  lineSpacing: 1.5,
  showSwipeHint: true,
  preferLastRead: true,
};

export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export async function updateSettings(
  partial: Partial<AppSettings>,
): Promise<AppSettings> {
  const current = await loadSettings();
  const next = { ...current, ...partial };
  await saveSettings(next);
  return next;
}

export function getPageBackground(
  brightness: number,
  darkMode: boolean,
): string {
  const t = Math.max(0, Math.min(100, brightness)) / 100;
  if (darkMode) {
    const r = Math.round(10 + t * 30);
    const g = Math.round(18 + t * 35);
    const b = Math.round(16 + t * 30);
    return `rgb(${r}, ${g}, ${b})`;
  }
  const r = Math.round(232 + t * 23);
  const g = Math.round(226 + t * 29);
  const b = Math.round(216 + t * 39);
  return `rgb(${r}, ${g}, ${b})`;
}
