import { create } from 'zustand';
import { supabase } from '@/src/lib/supabase';
import type { Reason } from '@/src/types';

interface ReasonState {
  reasons: Reason[];
  loading: boolean;
  saving: boolean;

  fetchReasons: (userId: string) => Promise<void>;
  addReason: (userId: string, content: string, emoji: string) => Promise<void>;
  updateReason: (reasonId: string, updates: { content?: string; emoji?: string }) => Promise<void>;
  deleteReason: (reasonId: string) => Promise<void>;
}

export const useReasonStore = create<ReasonState>((set) => ({
  reasons: [],
  loading: false,
  saving: false,

  fetchReasons: async (userId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('reasons')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching reasons:', error);
        return;
      }

      set({ reasons: data ?? [] });
    } finally {
      set({ loading: false });
    }
  },

  addReason: async (userId, content, emoji) => {
    set({ saving: true });
    try {
      const { data, error } = await supabase
        .from('reasons')
        .insert({ user_id: userId, content, emoji })
        .select()
        .single();

      if (error) {
        console.error('Error adding reason:', error);
        throw error;
      }

      set((s) => ({ reasons: [...s.reasons, data] }));
    } finally {
      set({ saving: false });
    }
  },

  updateReason: async (reasonId, updates) => {
    try {
      const { data, error } = await supabase
        .from('reasons')
        .update(updates)
        .eq('id', reasonId)
        .select()
        .single();

      if (error) {
        console.error('Error updating reason:', error);
        throw error;
      }

      set((s) => ({
        reasons: s.reasons.map((r) => (r.id === reasonId ? data : r)),
      }));
    } catch (e) {
      throw e;
    }
  },

  deleteReason: async (reasonId) => {
    try {
      const { error } = await supabase
        .from('reasons')
        .delete()
        .eq('id', reasonId);

      if (error) {
        console.error('Error deleting reason:', error);
        throw error;
      }

      set((s) => ({ reasons: s.reasons.filter((r) => r.id !== reasonId) }));
    } catch (e) {
      throw e;
    }
  },
}));
