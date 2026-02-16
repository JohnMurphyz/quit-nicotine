import { create } from 'zustand';
import { Platform } from 'react-native';
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

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
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

  restorePurchases: async () => {
    if (Platform.OS === 'web') return;

    set({ loading: true });
    try {
      const { restorePurchases } = await import('@/src/lib/revenueCat');
      await restorePurchases();
    } finally {
      set({ loading: false });
    }
  },

  purchaseMobile: async (packageId) => {
    set({ loading: true });
    try {
      const { purchasePackage } = await import('@/src/lib/revenueCat');
      const isActive = await purchasePackage(packageId);
      if (isActive) {
        set({ status: 'active', isActive: true });
      }
    } finally {
      set({ loading: false });
    }
  },

  purchaseWeb: async (userId, priceId) => {
    set({ loading: true });
    try {
      const { createCheckoutSession } = await import('@/src/lib/stripe');
      await createCheckoutSession(userId, priceId);
    } finally {
      set({ loading: false });
    }
  },
}));
