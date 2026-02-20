import { PartnerDashboardScreen } from '@/src/screens/PartnerDashboardScreen';
import { useAuthStore } from '@/src/stores/authStore';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppNavigator } from './AppNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { session, profile } = useAuthStore();

  const isGuest = profile?.role === 'guest';
  const showApp = session && profile?.onboarding_completed && !isGuest;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {showApp ? (
        <Stack.Screen name="App" component={AppNavigator} />
      ) : isGuest ? (
        <Stack.Screen name="GuestApp" component={PartnerDashboardScreen as any} />
      ) : (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      )}
    </Stack.Navigator>
  );
}
