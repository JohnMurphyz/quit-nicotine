import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { useSubscriptionStore } from '@/src/stores/subscriptionStore';
import { useAuthStore } from '@/src/stores/authStore';
import { syncSubscriptionToSupabase } from '@/src/lib/revenueCat';

interface PaywallGateProps {
  children: React.ReactNode;
}

export function PaywallGate({ children }: PaywallGateProps) {
  const { isActive, loading, presentPaywallIfNeeded, fetchStatus } = useSubscriptionStore();
  const user = useAuthStore((s) => s.user);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (loading || isActive || Platform.OS === 'web') {
      setChecked(true);
      return;
    }

    let mounted = true;

    (async () => {
      const purchased = await presentPaywallIfNeeded();

      if (!mounted) return;

      if (purchased && user?.id) {
        await syncSubscriptionToSupabase(user.id);
        await fetchStatus(user.id);
      }

      setChecked(true);
    })();

    return () => {
      mounted = false;
    };
  }, [isActive, loading]);

  if (loading || !checked) {
    return (
      <View className="flex-1 items-center justify-center bg-dark-900">
        <ActivityIndicator size="large" color="#34d399" />
      </View>
    );
  }

  return <>{children}</>;
}
