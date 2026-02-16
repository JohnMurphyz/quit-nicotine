import { create } from 'zustand';
import { supabase } from '@/src/lib/supabase';
import { formatInTimeZone } from 'date-fns-tz';
import type { StreakData, StreakConfirmation } from '@/src/types';

interface StreakState {
  streak: StreakData | null;
  confirmations: StreakConfirmation[];
  loading: boolean;
  confirming: boolean;

  fetchStreak: (userId: string) => Promise<void>;
  fetchConfirmations: (userId: string) => Promise<void>;
  confirmToday: (userId: string, timezone: string) => Promise<void>;
}

export const useStreakStore = create<StreakState>((set, get) => ({
  streak: null,
  confirmations: [],
  loading: false,
  confirming: false,

  fetchStreak: async (userId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.rpc('get_streak', {
        p_user_id: userId,
      });

      if (error) {
        console.error('Error fetching streak:', error);
        return;
      }

      set({ streak: data as unknown as StreakData });
    } finally {
      set({ loading: false });
    }
  },

  fetchConfirmations: async (userId) => {
    const { data, error } = await supabase
      .from('streak_confirmations')
      .select('*')
      .eq('user_id', userId)
      .order('confirmed_date', { ascending: false });

    if (error) {
      console.error('Error fetching confirmations:', error);
      return;
    }

    set({ confirmations: data ?? [] });
  },

  confirmToday: async (userId, timezone) => {
    const { streak } = get();
    if (!streak || streak.confirmed_today) return;

    set({ confirming: true });

    // Optimistic update
    const previousStreak = streak;
    set({
      streak: {
        ...streak,
        confirmed_today: true,
        current_streak: streak.current_streak + 1,
        longest_streak: Math.max(streak.longest_streak, streak.current_streak + 1),
        last_confirmed: formatInTimeZone(new Date(), timezone, 'yyyy-MM-dd'),
      },
    });

    try {
      const todayDate = formatInTimeZone(new Date(), timezone, 'yyyy-MM-dd');

      const { error } = await supabase.from('streak_confirmations').insert({
        user_id: userId,
        confirmed_date: todayDate,
      });

      if (error) {
        // Revert optimistic update
        set({ streak: previousStreak });
        console.error('Error confirming today:', error);
        throw error;
      }

      // Refetch to get accurate server-side calculation
      await get().fetchStreak(userId);
      await get().fetchConfirmations(userId);
    } finally {
      set({ confirming: false });
    }
  },
}));
