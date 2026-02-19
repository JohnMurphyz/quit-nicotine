import { create } from 'zustand';
import { supabase } from '@/src/lib/supabase';
import type { JournalEntry, Mood } from '@/src/types';

interface JournalState {
  entries: JournalEntry[];
  loading: boolean;
  saving: boolean;

  fetchEntries: (userId: string) => Promise<void>;
  addEntry: (userId: string, mood: Mood, content?: string) => Promise<void>;
}

export const useJournalStore = create<JournalState>((set) => ({
  entries: [],
  loading: false,
  saving: false,

  fetchEntries: async (userId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching journal entries:', error);
        return;
      }

      set({ entries: data ?? [] });
    } finally {
      set({ loading: false });
    }
  },

  addEntry: async (userId, mood, content) => {
    set({ saving: true });
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: userId,
          mood,
          content: content || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding journal entry:', error);
        throw error;
      }

      set((s) => ({ entries: [data, ...s.entries] }));
    } finally {
      set({ saving: false });
    }
  },
}));
