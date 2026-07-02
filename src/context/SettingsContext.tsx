import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { colors, darkColors } from '../theme/colors';
import {
  AppSettings,
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
} from '../services/settingsService';

type ThemeColors = typeof colors;

interface SettingsContextValue {
  settings: AppSettings;
  theme: ThemeColors;
  isDark: boolean;
  arabicFontSize: number;
  arabicLineHeight: number;
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => void;
  resetSettings: () => void;
  loaded: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSettings().then(s => {
      setSettings(s);
      setLoaded(true);
    });
  }, []);

  const persist = useCallback(async (next: AppSettings) => {
    setSettings(next);
    await saveSettings(next);
  }, []);

  const updateSetting = useCallback(
    <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      setSettings(prev => {
        const next = { ...prev, [key]: value };
        saveSettings(next);
        return next;
      });
    },
    [],
  );

  const resetSettings = useCallback(() => {
    persist({ ...DEFAULT_SETTINGS });
  }, [persist]);

  const isDark = settings.darkMode;
  const theme = isDark ? darkColors : colors;
  const arabicLineHeight = settings.arabicFontSize * settings.lineSpacing;

  const value = useMemo(
    () => ({
      settings,
      theme,
      isDark,
      arabicFontSize: settings.arabicFontSize,
      arabicLineHeight,
      updateSetting,
      resetSettings,
      loaded,
    }),
    [
      settings,
      theme,
      isDark,
      arabicLineHeight,
      updateSetting,
      resetSettings,
      loaded,
    ],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within SettingsProvider');
  }
  return ctx;
}
