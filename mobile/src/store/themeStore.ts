import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export const lightTheme = {
  bg: '#f8fafc',
  surface: '#ffffff',
  surfaceBorder: '#f1f5f9',
  text: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#64748b',
  accent: '#ea580c',
  accentLight: '#fff7ed',
  inputBorder: '#cbd5e1',
  inputBg: '#ffffff',
  divider: '#e2e8f0',
  error: '#ef4444',
  btnDisabled: 'rgba(234,88,12,0.35)',
  logoutBg: '#e2e8f0',
  cardBg: '#ffffff',
};

export const darkTheme = {
  bg: '#0f172a',
  surface: '#1e293b',
  surfaceBorder: '#334155',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  accent: '#f97316',
  accentLight: '#431407',
  inputBorder: '#475569',
  inputBg: '#1e293b',
  divider: '#334155',
  error: '#f87171',
  btnDisabled: 'rgba(249,115,22,0.3)',
  logoutBg: '#334155',
  cardBg: '#1e293b',
};

export type ThemeColors = typeof lightTheme;

interface ThemeState {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: false,
      colors: lightTheme,
      toggleTheme: () => {
        const next = !get().isDark;
        set({ isDark: next, colors: next ? darkTheme : lightTheme });
      },
    }),
    {
      name: 'prototp-theme',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
