import { create } from 'zustand';
import { supabase } from '@/src/lib/supabase';
import type { Achievement } from '@/src/types';

interface AchievementState {
  achievements: Achievement[];
  loading: boolean;

  fetchAchievements: (userId: string) => Promise<void>;
  unlockAchievement: (userId: string, key: string) => Promise<boolean>;
  hasAchievement: (key: string) => boolean;
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  achievements: [],
  loading: false,

  fetchAchievements: async (userId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Error fetching achievements:', error);
        return;
      }

      set({ achievements: data ?? [] });
    } finally {
      set({ loading: false });
    }
  },

  unlockAchievement: async (userId, key) => {
    if (get().hasAchievement(key)) return false;

    const { data, error } = await supabase
      .from('achievements')
      .insert({ user_id: userId, achievement_key: key })
      .select()
      .single();

    if (error) {
      // May be duplicate, ignore
      if (error.code === '23505') return false;
      console.error('Error unlocking achievement:', error);
      return false;
    }

    set((s) => ({ achievements: [data, ...s.achievements] }));
    return true;
  },

  hasAchievement: (key) => {
    return get().achievements.some((a) => a.achievement_key === key);
  },
}));
