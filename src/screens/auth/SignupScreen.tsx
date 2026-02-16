import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Alert, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/src/stores/authStore';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import * as Localization from 'expo-localization';
import type { AuthStackParamList } from '@/src/navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

export default function SignupScreen() {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const { signUp, loading, updateProfile } = useAuthStore();

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in email and password.');
      return;
    }

    try {
      await signUp(email, password, displayName || undefined);

      const timezone = Localization.getCalendars()[0]?.timeZone ?? 'UTC';
      setTimeout(async () => {
        try {
          await updateProfile({ timezone });
        } catch {
          // Non-critical
        }
      }, 1000);
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message ?? 'Something went wrong.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Start Your Journey
          </Text>
          <Text className="text-base text-gray-500">
            Create an account to begin tracking your nicotine-free days.
          </Text>
        </View>

        <Input
          label="Display Name"
          placeholder="Your name"
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
          title="Create Account"
          onPress={handleSignup}
          loading={loading}
          size="lg"
        />

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500">Already have an account? </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text className="text-primary-600 font-semibold">Sign In</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
