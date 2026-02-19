import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { Button } from '@/src/components/ui/Button';
import { OnboardingLayout } from '@/src/components/onboarding/OnboardingLayout';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'MindsetCommitment'>;

export default function MindsetCommitmentScreen({ navigation }: Props) {
  const { acknowledgedRule, setAcknowledgedRule } = useOnboardingStore();

  return (
    <OnboardingLayout
      step={6}
      companionMessage="This is important."
      onBack={() => navigation.goBack()}
      footer={
        <Button
          title="I'm ready"
          size="lg"
          disabled={!acknowledgedRule}
          onPress={() => navigation.navigate('Motivations')}
        />
      }
    >
      <View className="flex-1 px-6 justify-center">
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center">
            <Ionicons name="shield-checkmark" size={44} color="#8c7a66" />
          </View>
        </View>

        <Text className="text-2xl font-bold text-warm-800 text-center mb-6">
          The #1 rule of recovery
        </Text>

        <View className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 mb-6">
          <Text className="text-base text-warm-700 leading-6">
            One puff will undo everything. Not because you're weak — because that's how nicotine
            works. 95% of people who have "just one" go back to full-time use.
          </Text>
        </View>

        <Text className="text-sm text-warm-300 text-center mb-8 leading-5">
          This isn't meant to scare you. It's meant to free you. Once you know the rule, the
          decision is simple: not even one.
        </Text>

        <Pressable
          onPress={() => setAcknowledgedRule(!acknowledgedRule)}
          className="flex-row items-center self-center"
        >
          <View
            className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
              acknowledgedRule ? 'bg-warm-700 border-warm-700' : 'border-warm-300'
            }`}
          >
            {acknowledgedRule && <Text className="text-white text-xs font-bold">✓</Text>}
          </View>
          <Text className="text-base text-warm-600 font-medium">
            I understand — not even one.
          </Text>
        </Pressable>
      </View>
    </OnboardingLayout>
  );
}
