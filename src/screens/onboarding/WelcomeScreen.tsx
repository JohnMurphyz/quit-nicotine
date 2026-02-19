import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/src/components/ui/Button';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <View className="flex-1 justify-center items-center px-8">
        <View className="w-32 h-32 rounded-full bg-warm-200 items-center justify-center mb-8">
          <Ionicons name="leaf" size={64} color="#8c7a66" />
        </View>

        <Text className="text-3xl font-bold text-warm-800 text-center mb-4">
          You've already taken the hardest step
        </Text>

        <Text className="text-lg text-warm-400 text-center mb-2">
          Choosing freedom takes real courage.
        </Text>
        <Text className="text-lg text-warm-400 text-center mb-12">
          This is the beginning of your journey home.
        </Text>

        <View className="w-full">
          <Button
            title="Let's Get Started"
            size="lg"
            onPress={() => navigation.navigate('NicotineType')}
          />
        </View>

        <Pressable className="mt-6" onPress={() => navigation.navigate('Login')}>
          <Text className="text-warm-400 text-sm">
            Already have an account?{' '}
            <Text className="text-warm-700 font-semibold">Sign in</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
