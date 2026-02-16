import Purchases, {
  type PurchasesPackage,
  type CustomerInfo,
} from 'react-native-purchases';
import { Platform } from 'react-native';
import { RC_API_KEY, ENTITLEMENT_ID } from '@/src/constants/config';
import { supabase } from './supabase';

let initialized = false;

export async function initRevenueCat(userId: string) {
  if (Platform.OS === 'web' || initialized) return;

  Purchases.configure({ apiKey: RC_API_KEY, appUserID: userId });
  initialized = true;
}

export async function getOfferings() {
  const offerings = await Purchases.getOfferings();
  return offerings.current?.availablePackages ?? [];
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
  const customerInfo = await Purchases.getCustomerInfo();
  return checkEntitlement(customerInfo);
}

function checkEntitlement(customerInfo: CustomerInfo): boolean {
  return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
}

export async function syncSubscriptionToSupabase(userId: string) {
  if (Platform.OS === 'web') return;

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
