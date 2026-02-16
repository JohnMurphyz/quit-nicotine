import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Alert, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/src/stores/authStore';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import type { AuthStackParamList } from '@/src/navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message ?? 'Something went wrong.');
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
            Welcome Back
          </Text>
          <Text className="text-base text-gray-500">
            Sign in to continue your nicotine-free journey.
          </Text>
        </View>

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
          placeholder="Your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />

        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
          size="lg"
        />

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500">Don't have an account? </Text>
          <Pressable onPress={() => navigation.navigate('Signup')}>
            <Text className="text-primary-600 font-semibold">Sign Up</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
