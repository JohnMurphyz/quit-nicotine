import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import type { OnboardingStackParamList } from './types';

// Phase 1
import WalkthroughDrugScreen from '@/src/screens/onboarding/phase1/WalkthroughDrugScreen';
import WalkthroughFeaturesScreen from '@/src/screens/onboarding/phase1/WalkthroughFeaturesScreen';
import WalkthroughRecoveryScreen from '@/src/screens/onboarding/phase1/WalkthroughRecoveryScreen';
import WelcomeScreen from '@/src/screens/onboarding/phase1/WelcomeScreen';

// Phase 2
import QuizFrequencyCostScreen from '@/src/screens/onboarding/phase2/QuizFrequencyCostScreen';
import QuizNicotineTypeScreen from '@/src/screens/onboarding/phase2/QuizNicotineTypeScreen';
import QuizReadinessScreen from '@/src/screens/onboarding/phase2/QuizReadinessScreen';
import QuizTriggersScreen from '@/src/screens/onboarding/phase2/QuizTriggersScreen';
import QuizWhyScreen from '@/src/screens/onboarding/phase2/QuizWhyScreen';

// Phase 3
import PersonalizedResultsScreen from '@/src/screens/onboarding/phase3/PersonalizedResultsScreen';
import PaywallTrialIntroScreen from '@/src/screens/onboarding/phase3/PaywallTrialIntroScreen';
import PaywallInsightsScreen from '@/src/screens/onboarding/phase3/PaywallInsightsScreen';
import PaymentFailedScreen from '@/src/screens/onboarding/phase3/PaymentFailedScreen';

// Phase 4
import AuthCreationScreen from '@/src/screens/onboarding/phase4/AuthCreationScreen';
import FinalPledgeScreen from '@/src/screens/onboarding/phase4/FinalPledgeScreen';
import PaywallScreen from '@/src/screens/onboarding/phase3/PaywallScreen';
import SetQuitDateScreen from '@/src/screens/onboarding/phase4/SetQuitDateScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  const { loadPersisted } = useOnboardingStore();

  useEffect(() => {
    loadPersisted();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {/* Phase 1: Walkthrough Setup */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="WalkthroughDrug" component={WalkthroughDrugScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="WalkthroughRecovery" component={WalkthroughRecoveryScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="WalkthroughFeatures" component={WalkthroughFeaturesScreen} options={{ animation: 'slide_from_right' }} />

      {/* Phase 2: Quiz */}
      <Stack.Screen name="QuizNicotineType" component={QuizNicotineTypeScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="QuizFrequencyCost" component={QuizFrequencyCostScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="QuizWhy" component={QuizWhyScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="QuizTriggers" component={QuizTriggersScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="QuizReadiness" component={QuizReadinessScreen} options={{ animation: 'slide_from_right' }} />

      {/* Phase 3: Results & Account */}
      <Stack.Screen name="PersonalizedResults" component={PersonalizedResultsScreen} />
      <Stack.Screen name="AuthCreation" component={AuthCreationScreen} />

      {/* Phase 4: Commitment & Paywall */}
      <Stack.Screen name="SetQuitDate" component={SetQuitDateScreen} />
      <Stack.Screen name="FinalPledge" component={FinalPledgeScreen} />
      <Stack.Screen name="PaywallTrialIntro" component={PaywallTrialIntroScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="PaywallInsights" component={PaywallInsightsScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Paywall" component={PaywallScreen} />
      <Stack.Screen name="PaymentFailed" component={PaymentFailedScreen} options={{ animation: 'slide_from_bottom' }} />
    </Stack.Navigator>
  );
}
