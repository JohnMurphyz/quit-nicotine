import { useEffect } from 'react';
import { useStreakStore } from '@/src/stores/streakStore';
import { useAuthStore } from '@/src/stores/authStore';

export function useStreak(targetUserId?: string) {
  const { user, profile } = useAuthStore();
  const store = useStreakStore();

  const userId = targetUserId ?? user?.id;

  useEffect(() => {
    if (userId) {
      store.fetchStreak(userId);
      store.fetchConfirmations(userId);
    }
  }, [userId]);

  const confirmToday = async () => {
    if (!user?.id || !profile?.timezone) return;
    await store.confirmToday(user.id, profile.timezone);
  };

  return {
    ...store,
    confirmToday,
  };
}
