import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from './types';
import WelcomeScreen from '@/src/screens/onboarding/WelcomeScreen';
import NicotineTypeScreen from '@/src/screens/onboarding/NicotineTypeScreen';
import UsageLevelScreen from '@/src/screens/onboarding/UsageLevelScreen';
import CostQuitDateScreen from '@/src/screens/onboarding/CostQuitDateScreen';
import ReadinessScreen from '@/src/screens/onboarding/ReadinessScreen';
import CurrentStatusScreen from '@/src/screens/onboarding/CurrentStatusScreen';
import DestroyItScreen from '@/src/screens/onboarding/DestroyItScreen';
import MindsetCommitmentScreen from '@/src/screens/onboarding/MindsetCommitmentScreen';
import MotivationsScreen from '@/src/screens/onboarding/MotivationsScreen';
import LecturePreferenceScreen from '@/src/screens/onboarding/LecturePreferenceScreen';
import AccountCreationScreen from '@/src/screens/onboarding/AccountCreationScreen';
import LoginScreen from '@/src/screens/auth/LoginScreen';
import InviteScreen from '@/src/screens/auth/InviteScreen';
import { useOnboardingStore } from '@/src/stores/onboardingStore';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  const { loadPersisted } = useOnboardingStore();

  useEffect(() => {
    loadPersisted();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="NicotineType" component={NicotineTypeScreen} />
      <Stack.Screen name="UsageLevel" component={UsageLevelScreen} />
      <Stack.Screen name="CostQuitDate" component={CostQuitDateScreen} />
      <Stack.Screen name="Readiness" component={ReadinessScreen} />
      <Stack.Screen name="CurrentStatus" component={CurrentStatusScreen} />
      <Stack.Screen name="DestroyIt" component={DestroyItScreen} />
      <Stack.Screen name="MindsetCommitment" component={MindsetCommitmentScreen} />
      <Stack.Screen name="Motivations" component={MotivationsScreen} />
      <Stack.Screen name="LecturePreference" component={LecturePreferenceScreen} />
      <Stack.Screen name="AccountCreation" component={AccountCreationScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Invite" component={InviteScreen} />
    </Stack.Navigator>
  );
}
