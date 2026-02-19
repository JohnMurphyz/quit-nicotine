import { View, Text } from 'react-native';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { Button } from '@/src/components/ui/Button';
import { OnboardingLayout } from '@/src/components/onboarding/OnboardingLayout';
import { SelectionCard } from '@/src/components/onboarding/SelectionCard';
import type { NicotineType } from '@/src/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'NicotineType'>;

const OPTIONS: { value: NicotineType; label: string }[] = [
  { value: 'cigarettes', label: 'Cigarettes' },
  { value: 'vapes', label: 'Vapes / E-cigs' },
  { value: 'pouches', label: 'Pouches / Snus' },
  { value: 'chewing', label: 'Chewing Tobacco' },
  { value: 'multiple', label: 'Multiple Types' },
];

export default function NicotineTypeScreen({ navigation }: Props) {
  const { nicotineType, setNicotineType } = useOnboardingStore();

  return (
    <OnboardingLayout
      step={1}
      companionMessage="Let's get to know you."
      onBack={() => navigation.goBack()}
      footer={
        <>
          <Text className="text-sm text-warm-300 text-center mb-4">
            This helps us personalize your plan.
          </Text>
          <Button
            title="Continue"
            size="lg"
            disabled={!nicotineType}
            onPress={() => navigation.navigate('UsageLevel')}
          />
        </>
      }
    >
      <View className="flex-1 px-6 pt-4">
        <Text className="text-3xl font-light text-warm-800 mb-8">
          What type of nicotine do you use?
        </Text>

        <View className="gap-3">
          {OPTIONS.map((opt) => (
            <SelectionCard
              key={opt.value}
              label={opt.label}
              selected={nicotineType === opt.value}
              dimmed={nicotineType !== null && nicotineType !== opt.value}
              onPress={() => setNicotineType(opt.value)}
            />
          ))}
        </View>
      </View>
    </OnboardingLayout>
  );
}
