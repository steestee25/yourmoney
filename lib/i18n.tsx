import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import locales from '../locales/locales.json';

// Storage key used to persist selected locale
const STORAGE_KEY = 'yourmoney_locale'

function getAsyncStorage() {
  try {
    // Use require so web bundlers that don't include AsyncStorage won't fail at import time
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AsyncStorage = require('@react-native-async-storage/async-storage').default
    return AsyncStorage
  } catch (e) {
    return null
  }
}

type LocaleKey = 'en' | 'it';

type I18nContextType = {
  locale: LocaleKey;
  setLocale: (l: LocaleKey) => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
};

const defaultLocale: LocaleKey = 'it';

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function detectInitialLocale(): LocaleKey {
  try {
    // Browser / JS
    if (typeof navigator !== 'undefined' && navigator.language) {
      const l = navigator.language.toLowerCase();
      if (l.startsWith('en')) return 'en';
      if (l.startsWith('it')) return 'it';
    }
    // React Native fallback
    if (Platform && Platform.OS) {
      // Could inspect device locale with expo-localization later
      return defaultLocale;
    }
  } catch (e) {
    // ignore
  }
  return defaultLocale;
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<LocaleKey>(detectInitialLocale);

  // Load stored locale on mount (if available)
  useEffect(() => {
    const load = async () => {
      const AsyncStorage = getAsyncStorage()
      if (!AsyncStorage) return
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY)
        if (stored === 'en' || stored === 'it') {
          setLocaleState(stored)
        }
      } catch (e) {
        // ignore storage errors
      }
    }
    load()
  }, [])

  // Persist locale whenever it changes
  useEffect(() => {
    const persist = async () => {
      const AsyncStorage = getAsyncStorage()
      if (!AsyncStorage) return
      try {
        await AsyncStorage.setItem(STORAGE_KEY, locale)
      } catch (e) {
        // ignore
      }
    }
    persist()
  }, [locale])

  const t = (path: string, vars?: Record<string, string | number>) => {
    const parts = path.split('.');
    let node: any = (locales as any)[locale] ?? {};
    for (const p of parts) {
      node = node?.[p];
      if (node === undefined) break;
    }
    let str = typeof node === 'string' ? node : path;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(vars[k]));
      });
    }
    return str;
  };

  const setLocale = (l: LocaleKey) => setLocaleState(l)

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
};

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return {
    locale: ctx.locale,
    setLocale: ctx.setLocale,
    t: ctx.t,
  };
}

export default I18nProvider;
