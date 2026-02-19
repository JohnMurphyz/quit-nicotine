import { View, Text, Pressable, Keyboard } from 'react-native';
import { useState } from 'react';
import { format } from 'date-fns';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { OnboardingLayout } from '@/src/components/onboarding/OnboardingLayout';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'CostQuitDate'>;

export default function CostQuitDateScreen({ navigation }: Props) {
  const { dailyCost, quitDate, setCostAndQuitDate } = useOnboardingStore();
  const [cost, setCost] = useState(dailyCost?.toString() ?? '');
  const [date, setDate] = useState(quitDate ?? format(new Date(), 'yyyy-MM-dd'));
  const [hasntQuit, setHasntQuit] = useState(false);

  const canContinue = cost.length > 0;

  const handleContinue = () => {
    Keyboard.dismiss();
    const finalDate = hasntQuit ? format(new Date(), 'yyyy-MM-dd') : date;
    setCostAndQuitDate(parseFloat(cost) || 0, finalDate);
    navigation.navigate('Readiness');
  };

  return (
    <OnboardingLayout
      step={3}
      companionMessage="You're doing great."
      onBack={() => navigation.goBack()}
      footer={
        <Button
          title="Continue"
          size="lg"
          disabled={!canContinue}
          onPress={handleContinue}
        />
      }
    >
      <Pressable className="flex-1 px-6 pt-4" onPress={Keyboard.dismiss}>
        <Text className="text-3xl font-light text-warm-800 mb-2">
          Cost & Freedom Date
        </Text>
        <Text className="text-base text-warm-400 mb-8">
          We'll track how much money you're saving.
        </Text>

        <View className="mb-4">
          <Input
            label="How much do you spend per day? ($)"
            keyboardType="decimal-pad"
            value={cost}
            onChangeText={setCost}
          />
        </View>

        {cost.length > 0 && parseFloat(cost) > 0 && (
          <Text className="text-sm text-warm-700 font-medium mb-6">
            ${Math.round(parseFloat(cost) * 365).toLocaleString()}/year — imagine what you could do with that.
          </Text>
        )}

        {!hasntQuit && (
          <View className="mb-4">
            <Input
              label="Your freedom date (YYYY-MM-DD)"
              value={date}
              onChangeText={setDate}
            />
          </View>
        )}

        <Pressable
          onPress={() => setHasntQuit(!hasntQuit)}
          className="flex-row items-center mb-6"
        >
          <View
            className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
              hasntQuit ? 'bg-warm-700 border-warm-700' : 'border-warm-300'
            }`}
          >
            {hasntQuit && <Text className="text-white text-xs font-bold">✓</Text>}
          </View>
          <Text className="text-base text-warm-600">
            I haven't quit yet — I'm starting today
          </Text>
        </Pressable>
      </Pressable>
    </OnboardingLayout>
  );
}
