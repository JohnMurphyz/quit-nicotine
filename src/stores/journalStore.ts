import { create } from 'zustand';
import { supabase } from '@/src/lib/supabase';
import type { JournalEntry, Mood } from '@/src/types';

interface JournalState {
  entries: JournalEntry[];
  loading: boolean;
  saving: boolean;

  fetchEntries: (userId: string) => Promise<void>;
  addEntry: (userId: string, mood: Mood, title?: string, content?: string) => Promise<void>;
  updateEntry: (entryId: string, updates: { title?: string; content?: string; mood?: Mood }) => Promise<void>;
  deleteEntry: (entryId: string) => Promise<void>;
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

  addEntry: async (userId, mood, title, content) => {
    set({ saving: true });
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: userId,
          mood,
          title: title || null,
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

  updateEntry: async (entryId, updates) => {
    set({ saving: true });
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .update(updates)
        .eq('id', entryId)
        .select()
        .single();

      if (error) {
        console.error('Error updating journal entry:', error);
        throw error;
      }

      set((s) => ({
        entries: s.entries.map((e) => (e.id === entryId ? data : e)),
      }));
    } finally {
      set({ saving: false });
    }
  },

  deleteEntry: async (entryId) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);

      if (error) {
        console.error('Error deleting journal entry:', error);
        throw error;
      }

      set((s) => ({
        entries: s.entries.filter((e) => e.id !== entryId),
      }));
    } catch (e) {
      throw e;
    }
  },
}));
