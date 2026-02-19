import { View, Text } from 'react-native';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { Button } from '@/src/components/ui/Button';
import { OnboardingLayout } from '@/src/components/onboarding/OnboardingLayout';
import { SelectionCard } from '@/src/components/onboarding/SelectionCard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Readiness'>;

const OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "I've already stopped" },
  { value: 2, label: "I'm stopping today" },
  { value: 3, label: 'I have a date planned' },
  { value: 4, label: "I want to stop but I'm not sure when" },
  { value: 5, label: "I'm just exploring" },
];

export default function ReadinessScreen({ navigation }: Props) {
  const { readinessLevel, setReadinessLevel } = useOnboardingStore();

  const handleContinue = () => {
    if (readinessLevel === 5) {
      navigation.navigate('MindsetCommitment');
    } else {
      navigation.navigate('CurrentStatus');
    }
  };

  return (
    <OnboardingLayout
      step={4}
      companionMessage="Almost there."
      onBack={() => navigation.goBack()}
      footer={
        <Button
          title="Continue"
          size="lg"
          disabled={readinessLevel === null}
          onPress={handleContinue}
        />
      }
    >
      <View className="flex-1 px-6 pt-4">
        <Text className="text-3xl font-light text-warm-800 text-center mb-8">
          Where are you on your journey?
        </Text>

        <View className="gap-3">
          {OPTIONS.map((opt) => (
            <SelectionCard
              key={opt.value}
              label={opt.label}
              selected={readinessLevel === opt.value}
              dimmed={readinessLevel !== null && readinessLevel !== opt.value}
              onPress={() => setReadinessLevel(opt.value)}
            />
          ))}
        </View>
      </View>
    </OnboardingLayout>
  );
}
