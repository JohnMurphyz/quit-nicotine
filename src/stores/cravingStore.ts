import { create } from 'zustand';
import { supabase } from '@/src/lib/supabase';
import type { Craving, CravingTrigger } from '@/src/types';

interface CravingState {
  cravings: Craving[];
  loading: boolean;
  logging: boolean;

  fetchCravings: (userId: string) => Promise<void>;
  logCraving: (userId: string, details?: {
    intensity?: number;
    trigger?: CravingTrigger;
    note?: string;
  }) => Promise<void>;
  markResisted: (cravingId: string) => Promise<void>;
  getResisted: () => number;
}

export const useCravingStore = create<CravingState>((set, get) => ({
  cravings: [],
  loading: false,
  logging: false,

  fetchCravings: async (userId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('cravings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cravings:', error);
        return;
      }

      set({ cravings: data ?? [] });
    } finally {
      set({ loading: false });
    }
  },

  logCraving: async (userId, details) => {
    set({ logging: true });
    try {
      const { data, error } = await supabase
        .from('cravings')
        .insert({
          user_id: userId,
          intensity: details?.intensity ?? null,
          trigger: details?.trigger ?? null,
          note: details?.note ?? null,
          resisted: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error logging craving:', error);
        throw error;
      }

      set((s) => ({ cravings: [data, ...s.cravings] }));
    } finally {
      set({ logging: false });
    }
  },

  markResisted: async (cravingId) => {
    const { error } = await supabase
      .from('cravings')
      .update({ resisted: true })
      .eq('id', cravingId);

    if (error) {
      console.error('Error marking resisted:', error);
      return;
    }

    set((s) => ({
      cravings: s.cravings.map((c) =>
        c.id === cravingId ? { ...c, resisted: true } : c
      ),
    }));
  },

  getResisted: () => {
    return get().cravings.filter((c) => c.resisted).length;
  },
}));
