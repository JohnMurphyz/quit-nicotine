import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { Button } from '@/src/components/ui/Button';
import { OnboardingLayout } from '@/src/components/onboarding/OnboardingLayout';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'DestroyIt'>;

export default function DestroyItScreen({ navigation }: Props) {
  const { setDestroyedProducts } = useOnboardingStore();

  const handleChoice = (destroyed: boolean) => {
    setDestroyedProducts(destroyed);
    navigation.navigate('MindsetCommitment');
  };

  return (
    <OnboardingLayout
      step={5}
      companionMessage="You've got this."
      onBack={() => navigation.goBack()}
    >
      <View className="flex-1 justify-center items-center px-6">
        <View className="w-32 h-32 rounded-full bg-red-50 items-center justify-center mb-8">
          <Ionicons name="trash" size={64} color="#ef4444" />
        </View>

        <Text className="text-2xl font-bold text-warm-800 text-center mb-4">
          Take back control
        </Text>

        <Text className="text-base text-warm-400 text-center mb-12 leading-6">
          Every pack, pod, or tin you throw away is proof you're stronger than nicotine. You don't
          need a safety net.
        </Text>

        <View className="w-full gap-3">
          <Button
            title="I did it — they're gone!"
            size="lg"
            onPress={() => handleChoice(true)}
          />
          <Button
            title="I'll do it later"
            size="lg"
            variant="ghost"
            onPress={() => handleChoice(false)}
          />
        </View>
      </View>
    </OnboardingLayout>
  );
}
