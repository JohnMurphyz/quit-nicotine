import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { Button } from '@/src/components/ui/Button';
import { OnboardingLayout } from '@/src/components/onboarding/OnboardingLayout';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'LecturePreference'>;

export default function LecturePreferenceScreen({ navigation }: Props) {
  const { setWantsLecture, setInitialTab } = useOnboardingStore();

  const handleSelect = (wants: boolean) => {
    setWantsLecture(wants);
    setInitialTab(wants ? 'Learn' : 'Home');
    navigation.navigate('AccountCreation');
  };

  return (
    <OnboardingLayout
      step={8}
      companionMessage="Almost there!"
      onBack={() => navigation.goBack()}
    >
      <View className="flex-1 justify-center items-center px-6">
        <View className="w-24 h-24 rounded-full bg-warm-200 items-center justify-center mb-8">
          <Ionicons name="school" size={48} color="#8c7a66" />
        </View>

        <Text className="text-2xl font-bold text-warm-800 text-center mb-4">
          Your recovery toolkit
        </Text>

        <Text className="text-base text-warm-400 text-center mb-2">
          We've built short lessons that explain how nicotine traps you — and why freedom is easier
          than you think.
        </Text>
        <Text className="text-sm text-warm-300 text-center mb-12">
          Most people find it makes the first week dramatically easier.
        </Text>

        <View className="w-full gap-3">
          <Button
            title="Send me the lessons"
            size="lg"
            onPress={() => handleSelect(true)}
          />
          <Button
            title="I'll explore on my own"
            size="lg"
            variant="outline"
            onPress={() => handleSelect(false)}
          />
        </View>
      </View>
    </OnboardingLayout>
  );
}
