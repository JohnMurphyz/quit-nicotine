import { Platform } from 'react-native';
import { create } from 'zustand';
import { supabase } from '@/src/lib/supabase';
import {
  purchasePackage as rcPurchase,
  restorePurchases as rcRestore,
  checkSubscriptionStatus,
  syncSubscriptionToSupabase,
  setCustomerInfoListener,
  presentPaywall as rcPresentPaywall,
  presentPaywallIfNeeded as rcPresentPaywallIfNeeded,
  presentCustomerCenter as rcPresentCustomerCenter,
} from '@/src/lib/revenueCat';
import type { SubscriptionStatus } from '@/src/types';

interface SubscriptionState {
  status: SubscriptionStatus;
  loading: boolean;
  isActive: boolean;

  fetchStatus: (userId: string) => Promise<void>;
  setStatus: (status: SubscriptionStatus) => void;
  restorePurchases: (userId: string) => Promise<void>;
  purchaseMobile: (packageId: string, userId: string) => Promise<void>;
  purchaseWeb: (userId: string, priceId: string) => Promise<void>;
  presentPaywall: () => Promise<boolean>;
  presentPaywallIfNeeded: () => Promise<boolean>;
  presentCustomerCenter: () => Promise<void>;
  initListener: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  status: 'none',
  loading: false,
  isActive: false,

  fetchStatus: async (userId) => {
    set({ loading: true });
    try {
      // On native, check RevenueCat first for the freshest status
      if (Platform.OS !== 'web') {
        try {
          const isActive = await checkSubscriptionStatus();
          if (isActive) {
            set({ status: 'active', isActive: true });
            return;
          }
        } catch {
          // Fall through to Supabase check
        }
      }

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

  restorePurchases: async (userId) => {
    set({ loading: true });
    try {
      const isActive = await rcRestore();
      set({
        status: isActive ? 'active' : 'none',
        isActive,
      });
      await syncSubscriptionToSupabase(userId);
    } finally {
      set({ loading: false });
    }
  },

  purchaseMobile: async (packageId, userId) => {
    set({ loading: true });
    try {
      const isActive = await rcPurchase(packageId);
      set({
        status: isActive ? 'active' : 'none',
        isActive,
      });
      await syncSubscriptionToSupabase(userId);
    } finally {
      set({ loading: false });
    }
  },

  purchaseWeb: async () => {
    console.warn('Web purchases not configured yet');
  },

  // Present the RevenueCat UI paywall (designed in RC dashboard)
  presentPaywall: async () => {
    return rcPresentPaywall();
  },

  // Only presents paywall if user doesn't have the entitlement
  presentPaywallIfNeeded: async () => {
    return rcPresentPaywallIfNeeded();
  },

  // Present RevenueCat Customer Center for subscription management
  presentCustomerCenter: async () => {
    await rcPresentCustomerCenter();
  },

  initListener: () => {
    setCustomerInfoListener((isActive) => {
      set({
        status: isActive ? 'active' : 'expired',
        isActive,
      });
    });
  },
}));
