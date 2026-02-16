import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSubscription } from '@/src/hooks/useSubscription';
import { useAuthStore } from '@/src/stores/authStore';
import type { AppStackParamList } from '@/src/navigation/types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

interface PaywallGateProps {
  children: React.ReactNode;
}

export function PaywallGate({ children }: PaywallGateProps) {
  const navigation = useNavigation<Nav>();
  const { hasAccess, loading } = useSubscription();
  const { profile } = useAuthStore();

  useEffect(() => {
    if (!loading && profile && !hasAccess) {
      navigation.navigate('Paywall');
    }
  }, [loading, profile, hasAccess]);

  if (loading || !profile) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (!hasAccess) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return <>{children}</>;
}
