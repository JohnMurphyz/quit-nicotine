export type UserRole = 'user' | 'guest';
export type SubscriptionStatus = 'none' | 'active' | 'expired' | 'trial';
export type SubscriptionPlatform = 'ios' | 'android' | 'web';
export type PartnerStatus = 'active' | 'revoked';

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
    };
    Functions: {
      get_streak: {
        Args: { p_user_id: string };
        Returns: StreakData;
      };
    };
  };
}
