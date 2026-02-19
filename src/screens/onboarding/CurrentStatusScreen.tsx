import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { Button } from '@/src/components/ui/Button';
import { OnboardingLayout } from '@/src/components/onboarding/OnboardingLayout';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'CurrentStatus'>;

export default function CurrentStatusScreen({ navigation }: Props) {
  const { setHasProducts } = useOnboardingStore();

  const handleAnswer = (has: boolean) => {
    setHasProducts(has);
    if (has) {
      navigation.navigate('DestroyIt');
    } else {
      navigation.navigate('MindsetCommitment');
    }
  };

  return (
    <OnboardingLayout
      step={5}
      companionMessage="One quick question."
      onBack={() => navigation.goBack()}
    >
      <View className="flex-1 justify-center items-center px-6">
        <View className="w-24 h-24 rounded-full bg-amber-50 items-center justify-center mb-8">
          <Ionicons name="help-circle" size={56} color="#f59e0b" />
        </View>

        <Text className="text-2xl font-bold text-warm-800 text-center mb-4">
          Do you still have nicotine products around?
        </Text>

        <Text className="text-base text-warm-400 text-center mb-12">
          Be honest — this is just between us.
        </Text>

        <View className="w-full gap-3">
          <Button
            title="Yes, I still have some"
            size="lg"
            variant="outline"
            onPress={() => handleAnswer(true)}
          />
          <Button
            title="No, I've gotten rid of them"
            size="lg"
            onPress={() => handleAnswer(false)}
          />
        </View>
      </View>
    </OnboardingLayout>
  );
}
