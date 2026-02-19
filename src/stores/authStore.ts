import { create } from 'zustand';
import { supabase } from '@/src/lib/supabase';
import type { Profile } from '@/src/types';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  isAnonymous: boolean;

  setSession: (session: Session | null) => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  upgradeAnonymousAccount: (email: string, password: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  loading: false,
  initialized: false,
  isAnonymous: false,

  setSession: (session) => {
    set({ session, user: session?.user ?? null, isAnonymous: session?.user?.is_anonymous ?? false });
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    set({ profile: data });
  },

  updateProfile: async (updates) => {
    const { user, profile } = get();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    set({ profile: profile ? { ...profile, ...updates } : null });
  },

  signUp: async (email, password, displayName) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });
      if (error) throw error;
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ session: null, user: null, profile: null, isAnonymous: false });
  },

  signInAnonymously: async () => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
    } finally {
      set({ loading: false });
    }
  },

  upgradeAnonymousAccount: async (email, password) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.updateUser({ email, password });
      if (error) throw error;
      await get().fetchProfile();
      set({ isAnonymous: false });
    } finally {
      set({ loading: false });
    }
  },

  initialize: async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    set({
      session,
      user: session?.user ?? null,
      isAnonymous: session?.user?.is_anonymous ?? false,
      initialized: true,
    });

    if (session?.user) {
      await get().fetchProfile();
    }
  },
}));
