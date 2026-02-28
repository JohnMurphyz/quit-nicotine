import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Invite: { code: string };
};

export type OnboardingStackParamList = {
  // Phase 1: Walkthrough
  Welcome: undefined;
  WalkthroughDrug: undefined;
  WalkthroughRecovery: undefined;
  WalkthroughFeatures: undefined;

  // Phase 2: Quiz
  QuizNicotineType: undefined;
  QuizFrequencyCost: undefined;
  QuizWhy: undefined;
  QuizTriggers: undefined;
  QuizReadiness: undefined;

  // Phase 3: Results & Account
  PersonalizedResults: undefined;
  AuthCreation: undefined;

  // Phase 4: Commitment & Paywall
  SetQuitDate: undefined;
  FinalPledge: undefined;
  PaywallTrialIntro: undefined;
  PaywallInsights: undefined;
  Paywall: undefined;
  PaymentFailed: { message?: string };
};

export type TabParamList = {
  Home: undefined;
  Timeline: undefined;
  Journal: undefined;
  Learn: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  Paywall: undefined;
  Accountability: undefined;
  ContentDetail: { slug: string };
  CravingSOS: undefined;
  Articles: undefined;
  Settings: undefined;
  JournalDetail: { entryId: string };
  JournalEntry: { entryId?: string; initialTitle?: string; initialContent?: string };
  Reasons: undefined;
  JournalList: undefined;
  PartnerDashboardPreview: undefined;
  InvitePreview: { code: string };
  DestroyProducts: undefined;
  RelapseWizard: undefined;
  Relaxation: undefined;
  Motivation: undefined;
  Feedback: undefined;
  ContactUs: undefined;
};

export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
  GuestApp: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}
