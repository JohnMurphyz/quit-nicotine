import { useEffect } from 'react';
import { useJournalStore } from '@/src/stores/journalStore';
import { useAuthStore } from '@/src/stores/authStore';
import type { Mood } from '@/src/types';

export function useJournal() {
  const { user } = useAuthStore();
  const store = useJournalStore();

  useEffect(() => {
    if (user?.id) {
      store.fetchEntries(user.id).catch(() => {});
    }
  }, [user?.id]);

  const addEntry = async (mood: Mood, title?: string, content?: string) => {
    if (!user?.id) return;
    try {
      await store.addEntry(user.id, mood, title, content);
    } catch (e) {
      console.warn('Could not add journal entry (table may not exist yet):', e);
    }
  };

  return {
    ...store,
    addEntry,
  };
}
