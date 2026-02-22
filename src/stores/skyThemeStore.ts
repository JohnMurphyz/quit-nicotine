import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SkyTheme = 'static' | 'light';

const KEY = 'sky_theme';

interface SkyThemeStore {
  theme: SkyTheme;
  loaded: boolean;
  load: () => Promise<void>;
  setTheme: (theme: SkyTheme) => Promise<void>;
}

export const useSkyThemeStore = create<SkyThemeStore>((set) => ({
  theme: 'static',
  loaded: false,

  load: async () => {
    const stored = await AsyncStorage.getItem(KEY);
    if (stored === 'static' || stored === 'light') {
      set({ theme: stored, loaded: true });
    } else {
      set({ loaded: true });
    }
  },

  setTheme: async (theme) => {
    set({ theme });
    await AsyncStorage.setItem(KEY, theme);
  },
}));
