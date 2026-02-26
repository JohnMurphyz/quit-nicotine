import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSubscriptionStore } from '@/src/stores/subscriptionStore';
import { useAuthStore } from '@/src/stores/authStore';
import { syncSubscriptionToSupabase } from '@/src/lib/revenueCat';

export default function PaywallScreen() {
  const navigation = useNavigation();
  const { presentPaywall, fetchStatus } = useSubscriptionStore();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (Platform.OS === 'web') {
      navigation.goBack();
      return;
    }

    let mounted = true;

    (async () => {
      const purchased = await presentPaywall();

      if (!mounted) return;

      if (purchased && user?.id) {
        await syncSubscriptionToSupabase(user.id);
        await fetchStatus(user.id);
      }

      navigation.goBack();
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // RevenueCatUI presents its own full-screen modal — nothing to render here
  return null;
}
