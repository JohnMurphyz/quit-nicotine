import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Invite: { code: string };
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  NicotineType: undefined;
  UsageLevel: undefined;
  CostQuitDate: undefined;
  Readiness: undefined;
  CurrentStatus: undefined;
  DestroyIt: undefined;
  MindsetCommitment: undefined;
  Motivations: undefined;
  LecturePreference: undefined;
  AccountCreation: undefined;
  Login: undefined;
  Invite: { code: string };
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
