import { useEffect } from 'react';
import { useAuthStore } from '@/src/stores/authStore';
import { supabase } from '@/src/lib/supabase';

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
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return store;
}
