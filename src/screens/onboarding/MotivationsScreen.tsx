import { View, Text, Pressable, Keyboard } from 'react-native';
import { useState } from 'react';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { OnboardingLayout } from '@/src/components/onboarding/OnboardingLayout';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Motivations'>;

const MOTIVATION_OPTIONS = [
  'Health',
  'Family',
  'Money',
  'Fitness',
  'Self-control',
  'Appearance',
  'Smell & taste',
  'Energy',
  'Longevity',
  'Setting an example',
];

export default function MotivationsScreen({ navigation }: Props) {
  const { motivations, specificBenefit, supportPerson, setMotivations, setSpecificBenefit, setSupportPerson } = useOnboardingStore();
  const [selected, setSelected] = useState<string[]>(motivations);
  const [customText, setCustomText] = useState('');
  const [benefit, setBenefit] = useState(specificBenefit ?? '');
  const [person, setPerson] = useState(supportPerson ?? '');

  const toggleMotivation = (m: string) => {
    setSelected((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const handleContinue = () => {
    Keyboard.dismiss();
    const all = customText.trim()
      ? [...selected, customText.trim()]
      : selected;
    setMotivations(all);
    setSpecificBenefit(benefit.trim() || null);
    setSupportPerson(person.trim() || null);
    navigation.navigate('LecturePreference');
  };

  return (
    <OnboardingLayout
      step={7}
      companionMessage="The heart of it."
      onBack={() => navigation.goBack()}
      scrollable
      footer={
        <Button
          title="Continue"
          size="lg"
          disabled={selected.length === 0 && !customText.trim()}
          onPress={handleContinue}
        />
      }
    >
      <View className="px-6 pt-4">
        <Text className="text-3xl font-light text-warm-800 mb-2">
          Why are you quitting?
        </Text>
        <Text className="text-base text-warm-400 mb-6">
          Select all that apply. We'll remind you of these when it gets tough.
        </Text>

        <View className="flex-row flex-wrap gap-2 mb-6">
          {MOTIVATION_OPTIONS.map((m) => (
            <Pressable
              key={m}
              onPress={() => toggleMotivation(m)}
              className={`px-4 py-2 rounded-full ${
                selected.includes(m)
                  ? 'bg-warm-500'
                  : 'bg-warm-100'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  selected.includes(m) ? 'text-white' : 'text-warm-500'
                }`}
              >
                {m}
              </Text>
            </Pressable>
          ))}
        </View>

        <Input
          label="Add your own reason"
          value={customText}
          onChangeText={setCustomText}
        />

        <Input
          label="What will freedom look like?"
          value={benefit}
          onChangeText={setBenefit}
          multiline
        />

        <Input
          label="Who are you doing this for?"
          value={person}
          onChangeText={setPerson}
        />
      </View>
    </OnboardingLayout>
  );
}
