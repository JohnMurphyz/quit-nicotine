export type UserRole = 'user' | 'guest';
export type SubscriptionStatus = 'none' | 'active' | 'expired' | 'trial';
export type SubscriptionPlatform = 'ios' | 'android' | 'web';
export type PartnerStatus = 'active' | 'revoked';

export type NicotineType = 'cigarettes' | 'vapes' | 'pouches' | 'chewing' | 'multiple';
export type VapeType = 'disposable' | 'reusable';
export type CravingTrigger = 'stress' | 'boredom' | 'social' | 'after_meal' | 'alcohol' | 'morning' | 'habit' | 'other';
export type Mood = 'great' | 'good' | 'okay' | 'rough' | 'terrible';

export type UsageDetails =
  | { kind: 'cigarettes'; perDay: number; years: number }
  | { kind: 'vapes'; vapeType: VapeType; disposablesPerWeek?: number; nicStrength?: number; mlPerDay?: number; years: number }
  | { kind: 'pouches'; strength: number; pouchesPerDay: number; years: number }
  | { kind: 'chewing'; tinsPerWeek: number; years: number }
  | { kind: 'multiple'; items: UsageDetails[] };

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  timezone: string;
  invite_code: string;
  role: UserRole;
  linked_to: string | null;
  push_token: string | null;
  subscription_status: SubscriptionStatus;
  subscription_platform: SubscriptionPlatform | null;
  subscription_expires_at: string | null;
  nicotine_type: NicotineType | null;
  usage_per_day: number | null;
  years_used: number | null;
  usage_details: UsageDetails | null;
  daily_cost: number | null;
  quit_date: string | null;
  motivations: string[] | null;
  tracked_symptoms: string[] | null;
  wants_lecture: boolean | null;
  readiness_level: number | null;
  destroyed_products: boolean | null;
  acknowledged_law_of_addiction: boolean;
  specific_benefit: string | null;
  support_person: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface StreakConfirmation {
  id: string;
  user_id: string;
  confirmed_date: string;
  confirmed_at: string;
}

export interface AccountabilityPartner {
  id: string;
  user_id: string;
  partner_id: string;
  status: PartnerStatus;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  platform: SubscriptionPlatform;
  external_id: string;
  status: string;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_confirmed: string | null;
  confirmed_today: boolean;
}

export interface Craving {
  id: string;
  user_id: string;
  intensity: number | null;
  trigger: CravingTrigger | null;
  note: string | null;
  resisted: boolean;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  mood: Mood;
  content: string | null;
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_key: string;
  unlocked_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      streak_confirmations: {
        Row: StreakConfirmation;
        Insert: Omit<StreakConfirmation, 'id' | 'confirmed_at'>;
        Update: never;
      };
      accountability_partners: {
        Row: AccountabilityPartner;
        Insert: Omit<AccountabilityPartner, 'id' | 'created_at'>;
        Update: Pick<AccountabilityPartner, 'status'>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Subscription, 'id' | 'created_at'>>;
      };
      cravings: {
        Row: Craving;
        Insert: Omit<Craving, 'id' | 'created_at'>;
        Update: Partial<Omit<Craving, 'id' | 'created_at'>>;
      };
      journal_entries: {
        Row: JournalEntry;
        Insert: Omit<JournalEntry, 'id' | 'created_at'>;
        Update: Partial<Omit<JournalEntry, 'id' | 'created_at'>>;
      };
      achievements: {
        Row: Achievement;
        Insert: Omit<Achievement, 'id' | 'unlocked_at'>;
        Update: never;
      };
    };
    Functions: {
      get_streak: {
        Args: { p_user_id: string };
        Returns: StreakData;
      };
    };
  };
}
