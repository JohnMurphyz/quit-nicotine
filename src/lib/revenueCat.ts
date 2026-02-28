import Purchases, {
  type PurchasesPackage,
  type CustomerInfo,
  type Offering,
  LOG_LEVEL,
} from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { Platform } from 'react-native';
import { RC_API_KEY, ENTITLEMENT_ID } from '@/src/constants/config';
import { supabase } from './supabase';

let initialized = false;

type CustomerInfoListener = (isActive: boolean) => void;
let customerInfoListener: CustomerInfoListener | null = null;

export function setCustomerInfoListener(listener: CustomerInfoListener) {
  customerInfoListener = listener;
}

export function isInitialized() {
  return initialized;
}

// Call once at app startup (no userId = anonymous RC user).
// Offerings are available immediately after this, before any login.
export async function initRevenueCat(userId?: string) {
  if (Platform.OS === 'web' || initialized) return;

  if (!RC_API_KEY) {
    console.warn(
      '[RevenueCat] No API key found — skipping initialization. Set EXPO_PUBLIC_RC_IOS_KEY or EXPO_PUBLIC_RC_ANDROID_KEY in .env'
    );
    return;
  }

  try {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    Purchases.configure({ apiKey: RC_API_KEY, appUserID: userId });
    initialized = true;
    console.log('[RevenueCat] Initialized OK. userId:', userId ?? 'anonymous');

    Purchases.addCustomerInfoUpdateListener((customerInfo: CustomerInfo) => {
      const isActive = checkEntitlement(customerInfo);
      customerInfoListener?.(isActive);
    });
  } catch (error) {
    console.error('[RevenueCat] Failed to initialize:', error);
  }
}

// Call after the user authenticates to associate their purchases with their account.
export async function loginUser(userId: string) {
  if (!initialized) return;
  try {
    await Purchases.logIn(userId);
  } catch (error) {
    console.error('[RevenueCat] Failed to log in user:', error);
  }
}

export async function getOfferings(): Promise<Offering | null> {
  if (!initialized) {
    console.warn('[RevenueCat] getOfferings() called before initialization');
    return null;
  }
  const offerings = await Purchases.getOfferings();
  console.log('[RevenueCat] getOfferings result:', {
    current: offerings.current?.identifier ?? null,
    allOfferings: Object.keys(offerings.all ?? {}),
    packages: offerings.current?.availablePackages.map((p) => ({
      id: p.identifier,
      type: p.packageType,
      price: p.product.priceString,
    })) ?? [],
  });
  return offerings.current ?? null;
}

export function getOfferingMetadata<T>(offering: Offering, key: string, fallback: T): T {
  if (!offering.metadata) return fallback;
  const val = offering.metadata[key];
  return (val as T) ?? fallback;
}

export async function purchasePackage(packageId: string): Promise<boolean> {
  const offerings = await Purchases.getOfferings();
  const pkg = offerings.current?.availablePackages.find(
    (p: PurchasesPackage) => p.identifier === packageId
  );
  if (!pkg) throw new Error('Package not found');

  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return checkEntitlement(customerInfo);
}

export async function restorePurchases(): Promise<boolean> {
  const customerInfo = await Purchases.restorePurchases();
  return checkEntitlement(customerInfo);
}

export async function checkSubscriptionStatus(): Promise<boolean> {
  if (!initialized) return false;
  const customerInfo = await Purchases.getCustomerInfo();
  return checkEntitlement(customerInfo);
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (!initialized) return null;
  return Purchases.getCustomerInfo();
}

function checkEntitlement(customerInfo: CustomerInfo): boolean {
  return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
}

// RevenueCat UI Paywall — presents the remote paywall configured in the RC dashboard
export async function presentPaywall(): Promise<boolean> {
  if (!initialized) return false;
  const result = await RevenueCatUI.presentPaywall();
  return result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED;
}

export async function presentPaywallIfNeeded(): Promise<boolean> {
  if (!initialized) return false;
  const result = await RevenueCatUI.presentPaywallIfNeeded({
    requiredEntitlementIdentifier: ENTITLEMENT_ID,
  });
  return result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED;
}

// Customer Center — subscription management UI
export async function presentCustomerCenter(): Promise<void> {
  if (!initialized) {
    console.warn('[RevenueCat] Not initialized — cannot present Customer Center');
    return;
  }
  await RevenueCatUI.presentCustomerCenter();
}

export async function syncSubscriptionToSupabase(userId: string) {
  if (Platform.OS === 'web' || !initialized) return;

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const isActive = checkEntitlement(customerInfo);
    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];

    await supabase
      .from('profiles')
      .update({
        subscription_status: isActive ? 'active' : 'expired',
        subscription_platform: Platform.OS as 'ios' | 'android',
        subscription_expires_at: entitlement?.expirationDate ?? null,
      })
      .eq('id', userId);
  } catch (error) {
    console.error('Error syncing subscription:', error);
  }
}
