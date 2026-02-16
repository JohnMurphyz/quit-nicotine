import { useEffect } from 'react';
import { useSubscriptionStore } from '@/src/stores/subscriptionStore';
import { useAuthStore } from '@/src/stores/authStore';

export function useSubscription() {
  const { user, profile } = useAuthStore();
  const store = useSubscriptionStore();

  useEffect(() => {
    if (user?.id) {
      store.fetchStatus(user.id);
    }
  }, [user?.id]);

  const isGuest = profile?.role === 'guest';
  const hasAccess = isGuest || store.isActive;

  return {
    ...store,
    isGuest,
    hasAccess,
  };
}
