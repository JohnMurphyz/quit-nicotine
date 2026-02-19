import { useEffect } from 'react';
import { useAchievementStore } from '@/src/stores/achievementStore';
import { useAuthStore } from '@/src/stores/authStore';

export function useAchievements() {
  const { user } = useAuthStore();
  const store = useAchievementStore();

  useEffect(() => {
    if (user?.id) {
      store.fetchAchievements(user.id).catch(() => {});
    }
  }, [user?.id]);

  const unlock = async (key: string) => {
    if (!user?.id) return false;
    try {
      return await store.unlockAchievement(user.id, key);
    } catch (e) {
      console.warn('Could not unlock achievement (table may not exist yet):', e);
      return false;
    }
  };

  return {
    ...store,
    unlock,
  };
}
