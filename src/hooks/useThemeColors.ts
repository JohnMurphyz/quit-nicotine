import { useSkyThemeStore } from '@/src/stores/skyThemeStore';

export interface ThemeColors {
  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textAccent: string;

  // Surfaces
  cardBg: string;
  elevatedBg: string;
  borderColor: string;

  // Streak badge
  streakBg: string;
  streakBgActive: string;
  streakText: string;
  streakTextActive: string;

  // Timer pill
  pillBg: string;
  pillText: string;

  // Tab bar
  tabBarBg: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;

  // Mode flag
  isDark: boolean;
}

const LIGHT_COLORS: ThemeColors = {
  textPrimary: '#362d23',
  textSecondary: '#5a4a3e',
  textMuted: '#8c7a66',
  textAccent: '#b09a82',

  cardBg: '#f5efe8',
  elevatedBg: '#ebe1d4',
  borderColor: '#ebe1d4',

  streakBg: '#ebe1d4',
  streakBgActive: '#fef3c7',
  streakText: '#8c7a66',
  streakTextActive: '#d97706',

  pillBg: '#ebe1d4',
  pillText: '#6b5d4e',

  tabBarBg: '#faf7f4',
  tabBarBorder: '#ebe1d4',
  tabBarActive: '#4a3f33',
  tabBarInactive: '#b09a82',

  isDark: false,
};

const DARK_COLORS: ThemeColors = {
  textPrimary: '#ffffff',
  textSecondary: '#c4b5fd',
  textMuted: '#8580a8',
  textAccent: '#9b8ec4',

  cardBg: 'rgba(160,150,220,0.08)',
  elevatedBg: 'rgba(160,150,220,0.12)',
  borderColor: 'rgba(160,150,220,0.18)',

  streakBg: 'rgba(160,150,220,0.12)',
  streakBgActive: 'rgba(251,191,36,0.15)',
  streakText: '#8580a8',
  streakTextActive: '#fbbf24',

  pillBg: 'rgba(160,150,220,0.12)',
  pillText: '#c4b5fd',

  tabBarBg: '#0e0b28',
  tabBarBorder: 'rgba(160,150,220,0.12)',
  tabBarActive: '#c4b5fd',
  tabBarInactive: '#5c5880',

  isDark: true,
};

export function useThemeColors(): ThemeColors {
  const theme = useSkyThemeStore((s) => s.theme);
  return theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
}
