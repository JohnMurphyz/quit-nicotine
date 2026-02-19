import { create } from 'zustand';
import { supabase } from '@/src/lib/supabase';
import type { SubscriptionStatus } from '@/src/types';

interface SubscriptionState {
  status: SubscriptionStatus;
  loading: boolean;
  isActive: boolean;

  fetchStatus: (userId: string) => Promise<void>;
  setStatus: (status: SubscriptionStatus) => void;
  restorePurchases: () => Promise<void>;
  purchaseMobile: (packageId: string) => Promise<void>;
  purchaseWeb: (userId: string, priceId: string) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  status: 'none',
  loading: false,
  isActive: false,

  fetchStatus: async (userId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }

      const status = (data?.subscription_status ?? 'none') as SubscriptionStatus;
      set({ status, isActive: status === 'active' || status === 'trial' });
    } finally {
      set({ loading: false });
    }
  },

  setStatus: (status) => {
    set({ status, isActive: status === 'active' || status === 'trial' });
  },

  // TODO: Re-enable when RevenueCat is configured
  restorePurchases: async () => {
    console.warn('Purchases not configured yet');
  },

  purchaseMobile: async () => {
    console.warn('Purchases not configured yet');
  },

  purchaseWeb: async () => {
    console.warn('Purchases not configured yet');
  },
}));
