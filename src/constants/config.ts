import { Platform } from 'react-native';

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const RC_IOS_KEY = process.env.EXPO_PUBLIC_RC_IOS_KEY ?? '';
export const RC_ANDROID_KEY = process.env.EXPO_PUBLIC_RC_ANDROID_KEY ?? '';
export const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';

export const PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID ?? '';

export const INVITE_SCHEME = 'quitnicotine';
export const INVITE_WEB_DOMAIN = 'quitnicotine.app'; // Update with actual domain

export const NOTIFICATION_HOUR = 9; // 9 AM daily reminder
export const NOTIFICATION_MINUTE = 0;

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const RC_API_KEY = isIOS ? RC_IOS_KEY : RC_ANDROID_KEY;

export const ENTITLEMENT_ID = 'Freed Pro';
