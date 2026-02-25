import type { NicotineType, UsageDetails } from '@/src/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const STORAGE_KEY = 'onboarding_data';

interface OnboardingData {
  nicotineType: NicotineType | null;
  usageDetails: UsageDetails | null;
  dailyCost: number | null;
  costPerUnit: number | null;
  unitsPerWeek: number | null;
  quitDate: string | null; // ISO date string
  readinessLevel: number | null;
  hasProducts: boolean | null;
  destroyedProducts: boolean | null;
  acknowledgedRule: boolean;
  motivations: string[];
  specificBenefit: string | null;
  supportPerson: string | null;
  wantsLecture: boolean | null;

  // Quiz Fields
  triggers: string[];
  currency: string;
}

interface OnboardingState extends OnboardingData {
  initialTab: 'Home' | 'Learn';
  currentStep: number;
  setNicotineType: (type: NicotineType) => void;
  setUsageDetails: (details: UsageDetails) => void;
  setCostAndFrequency: (costPerUnit: number, unitsPerWeek: number) => void;
  setCostAndQuitDate: (dailyCost: number, quitDate: string) => void;
  setReadinessLevel: (level: number) => void;
  setHasProducts: (has: boolean) => void;
  setDestroyedProducts: (destroyed: boolean) => void;
  setAcknowledgedRule: (acknowledged: boolean) => void;
  setMotivations: (motivations: string[]) => void;
  setSpecificBenefit: (benefit: string | null) => void;
  setSupportPerson: (person: string | null) => void;
  setWantsLecture: (wants: boolean) => void;
  setInitialTab: (tab: 'Home' | 'Learn') => void;
  clearInitialTab: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  getData: () => OnboardingData;
  persist: () => Promise<void>;
  loadPersisted: () => Promise<void>;
  reset: () => void;

  setCurrency: (currency: string) => void;

  // Quiz Setters
  setTriggers: (triggers: string[]) => void;
}

const initialData: OnboardingData = {
  nicotineType: null,
  usageDetails: null,
  dailyCost: null,
  costPerUnit: null,
  unitsPerWeek: null,
  quitDate: null,
  readinessLevel: null,
  hasProducts: null,
  destroyedProducts: null,
  acknowledgedRule: false,
  motivations: [],
  specificBenefit: null,
  supportPerson: null,
  wantsLecture: null,
  triggers: [],
  currency: 'USD',
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialData,
  initialTab: 'Home',
  currentStep: 0,

  setNicotineType: (type) => {
    set({ nicotineType: type });
    get().persist();
  },

  setUsageDetails: (details) => {
    set({ usageDetails: details });
    get().persist();
  },

  setCostAndFrequency: (costPerUnit, unitsPerWeek) => {
    const dailyCost = (costPerUnit * unitsPerWeek) / 7;
    set({ costPerUnit, unitsPerWeek, dailyCost });
    get().persist();
  },

  setCostAndQuitDate: (dailyCost, quitDate) => {
    set({ dailyCost, quitDate });
    get().persist();
  },

  setReadinessLevel: (level) => {
    set({ readinessLevel: level });
    get().persist();
  },

  setHasProducts: (has) => {
    set({ hasProducts: has });
    get().persist();
  },

  setDestroyedProducts: (destroyed) => {
    set({ destroyedProducts: destroyed });
    get().persist();
  },

  setAcknowledgedRule: (acknowledged) => {
    set({ acknowledgedRule: acknowledged });
    get().persist();
  },

  setMotivations: (motivations) => {
    set({ motivations });
    get().persist();
  },

  setSpecificBenefit: (benefit) => {
    set({ specificBenefit: benefit });
    get().persist();
  },

  setSupportPerson: (person) => {
    set({ supportPerson: person });
    get().persist();
  },

  setWantsLecture: (wants) => {
    set({ wantsLecture: wants });
    get().persist();
  },

  setInitialTab: (tab) => set({ initialTab: tab }),
  clearInitialTab: () => set({ initialTab: 'Home' }),

  nextStep: () => set((s) => ({ currentStep: s.currentStep + 1 })),
  prevStep: () => set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),
  setStep: (step) => set({ currentStep: step }),

  getData: () => {
    const s = get();
    return {
      nicotineType: s.nicotineType,
      usageDetails: s.usageDetails,
      dailyCost: s.dailyCost,
      costPerUnit: s.costPerUnit,
      unitsPerWeek: s.unitsPerWeek,
      quitDate: s.quitDate,
      readinessLevel: s.readinessLevel,
      hasProducts: s.hasProducts,
      destroyedProducts: s.destroyedProducts,
      acknowledgedRule: s.acknowledgedRule,
      motivations: s.motivations,
      specificBenefit: s.specificBenefit,
      supportPerson: s.supportPerson,
      wantsLecture: s.wantsLecture,
      triggers: s.triggers,
      currency: s.currency,
    };
  },

  setCurrency: (currency) => {
    set({ currency });
    get().persist();
  },

  setTriggers: (triggers) => {
    set({ triggers });
    get().persist();
  },

  persist: async () => {
    const data = get().getData();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  loadPersisted: async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as OnboardingData;
      set(data);
    }
  },

  reset: () => {
    set({ ...initialData, currentStep: 0 });
    AsyncStorage.removeItem(STORAGE_KEY);
  },
}));
