import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Localization from 'expo-localization';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { useAuthStore } from '@/src/stores/authStore';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import type { UsageDetails } from '@/src/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'AccountCreation'>;

function deriveBackwardCompat(details: UsageDetails | null): { usage_per_day: number | null; years_used: number | null } {
  if (!details) return { usage_per_day: null, years_used: null };
  switch (details.kind) {
    case 'cigarettes':
      return { usage_per_day: details.perDay, years_used: details.years };
    case 'pouches':
      return { usage_per_day: details.pouchesPerDay, years_used: details.years };
    case 'vapes':
      return { usage_per_day: details.disposablesPerWeek ?? null, years_used: details.years };
    case 'chewing':
      return { usage_per_day: details.tinsPerWeek, years_used: details.years };
    case 'multiple':
      if (details.items.length > 0) return deriveBackwardCompat(details.items[0]);
      return { usage_per_day: null, years_used: null };
  }
}

export default function AccountCreationScreen(_props: Props) {
  const { getData, reset } = useOnboardingStore();
  const { session, isAnonymous, signUp, signInAnonymously, updateProfile, loading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const isExistingRealUser = session && !isAnonymous;

  const buildProfilePayload = () => {
    const data = getData();
    const compat = deriveBackwardCompat(data.usageDetails);
    const timezone = Localization.getCalendars()[0]?.timeZone ?? 'UTC';
    return {
      nicotine_type: data.nicotineType,
      usage_per_day: compat.usage_per_day,
      years_used: compat.years_used,
      usage_details: data.usageDetails,
      daily_cost: data.dailyCost,
      quit_date: data.quitDate,
      motivations: data.motivations,
      wants_lecture: data.wantsLecture,
      readiness_level: data.readinessLevel,
      destroyed_products: data.destroyedProducts,
      acknowledged_law_of_addiction: data.acknowledgedRule,
      specific_benefit: data.specificBenefit,
      support_person: data.supportPerson,
      timezone,
      onboarding_completed: true,
    };
  };

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in email and password.');
      return;
    }
    try {
      await signUp(email, password, displayName || undefined);
      await new Promise((resolve) => setTimeout(resolve, 800));
      await updateProfile(buildProfilePayload());
      reset();
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message ?? 'Something went wrong.');
    }
  };

  const handleAnonymous = async () => {
    try {
      await signInAnonymously();
      await new Promise((resolve) => setTimeout(resolve, 800));
      await updateProfile(buildProfilePayload());
      reset();
    } catch (error: any) {
      Alert.alert('Something went wrong', error.message ?? 'Please try again.');
    }
  };

  const handleConfirm = async () => {
    try {
      await updateProfile(buildProfilePayload());
      reset();
    } catch (error: any) {
      Alert.alert('Something went wrong', error.message ?? 'Please try again.');
    }
  };

  if (isExistingRealUser) {
    return (
      <SafeAreaView className="flex-1 bg-warm-50">
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-3xl font-bold text-warm-800 text-center mb-4">
            Confirm your plan
          </Text>
          <Text className="text-base text-warm-400 text-center mb-12">
            Your updated preferences will be saved to your account.
          </Text>
          <View className="w-full">
            <Button
              title="Save my plan"
              size="lg"
              loading={loading}
              onPress={handleConfirm}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-warm-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <View className="mb-8">
          <Text className="text-3xl font-bold text-warm-800 mb-2">
            Save your plan
          </Text>
          <Text className="text-base text-warm-400">
            Create a free account to keep your progress safe.
          </Text>
        </View>

        <Input
          label="Display Name"
          placeholder="Your name (optional)"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
          autoComplete="name"
        />

        <Input
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <Input
          label="Password"
          placeholder="Choose a password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
        />

        <Button
          title="Create Free Account"
          size="lg"
          loading={loading}
          onPress={handleSignup}
        />

        <Pressable className="mt-6 items-center" onPress={handleAnonymous} disabled={loading}>
          <Text className="text-warm-400 text-sm">Try without an account</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
