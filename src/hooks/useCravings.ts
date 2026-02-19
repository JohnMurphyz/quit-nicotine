import { useEffect } from 'react';
import { useCravingStore } from '@/src/stores/cravingStore';
import { useAuthStore } from '@/src/stores/authStore';
import type { CravingTrigger } from '@/src/types';

export function useCravings() {
  const { user } = useAuthStore();
  const store = useCravingStore();

  useEffect(() => {
    if (user?.id) {
      store.fetchCravings(user.id).catch(() => {});
    }
  }, [user?.id]);

  const logCraving = async (details?: {
    intensity?: number;
    trigger?: CravingTrigger;
    note?: string;
  }) => {
    if (!user?.id) return;
    try {
      await store.logCraving(user.id, details);
    } catch (e) {
      console.warn('Could not log craving (table may not exist yet):', e);
    }
  };

  const markResisted = async (cravingId: string) => {
    try {
      await store.markResisted(cravingId);
    } catch (e) {
      console.warn('Could not mark resisted:', e);
    }
  };

  return {
    ...store,
    logCraving,
    markResisted,
  };
}
