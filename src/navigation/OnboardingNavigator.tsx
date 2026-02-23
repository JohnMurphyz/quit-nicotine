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
import QuizPastAttemptsScreen from '@/src/screens/onboarding/phase2/QuizPastAttemptsScreen';
import QuizTriggersScreen from '@/src/screens/onboarding/phase2/QuizTriggersScreen';
import QuizWhyScreen from '@/src/screens/onboarding/phase2/QuizWhyScreen';

// Phase 3
import AnalysisLoadingScreen from '@/src/screens/onboarding/phase3/AnalysisLoadingScreen';
import PaywallScreen from '@/src/screens/onboarding/phase3/PaywallScreen';
import ValueRevealScreen from '@/src/screens/onboarding/phase3/ValueRevealScreen';

// Phase 4
import AuthCreationScreen from '@/src/screens/onboarding/phase4/AuthCreationScreen';
import FinalPledgeScreen from '@/src/screens/onboarding/phase4/FinalPledgeScreen';
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
        animation: 'fade', // Better for high-end feel than slide
      }}
    >
      {/* Phase 1: Walkthrough Setup */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="WalkthroughDrug" component={WalkthroughDrugScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="WalkthroughRecovery" component={WalkthroughRecoveryScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="WalkthroughFeatures" component={WalkthroughFeaturesScreen} options={{ animation: 'slide_from_right' }} />

      {/* Phase 2: Quiz */}
      <Stack.Screen
        name="QuizNicotineType"
        component={QuizNicotineTypeScreen}
        options={{ animation: 'slide_from_right' }} // Slide for quiz flow
      />
      <Stack.Screen
        name="QuizFrequencyCost"
        component={QuizFrequencyCostScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="QuizWhy"
        component={QuizWhyScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="QuizTriggers"
        component={QuizTriggersScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="QuizPastAttempts"
        component={QuizPastAttemptsScreen}
        options={{ animation: 'slide_from_right' }}
      />

      {/* Phase 3: Value & Paywall */}
      <Stack.Screen name="AnalysisLoading" component={AnalysisLoadingScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="ValueReveal" component={ValueRevealScreen} />
      <Stack.Screen name="Paywall" component={PaywallScreen} />

      {/* Phase 4: Commitment */}
      <Stack.Screen name="AuthCreation" component={AuthCreationScreen} />
      <Stack.Screen name="SetQuitDate" component={SetQuitDateScreen} />
      <Stack.Screen name="FinalPledge" component={FinalPledgeScreen} />
    </Stack.Navigator>
  );
}
