import { useEffect } from 'react';
import { useAuthStore } from '@/src/stores/authStore';
import { useSubscriptionStore } from '@/src/stores/subscriptionStore';
import { supabase } from '@/src/lib/supabase';
import { initRevenueCat } from '@/src/lib/revenueCat';

export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    if (!store.initialized) {
      store.initialize();
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        store.setSession(session);
        if (session?.user) {
          await store.fetchProfile();

          // Initialize RevenueCat with the user's ID
          await initRevenueCat(session.user.id);

          // Set up the customer info listener to keep store in sync
          useSubscriptionStore.getState().initListener();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return store;
}
