import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { AuthStackParamList } from '@/src/navigation/types';
import { useAuthStore } from '@/src/stores/authStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DEV_EMAIL = 'test@quitnicotine.dev';
const DEV_PASSWORD = 'testtest123';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Login'>>();

  // Also pre-fetch the root navigation to reset to Auth stack
  const rootNavigation = useNavigation<NativeStackNavigationProp<any>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp, loading } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      await signIn(email, password);
      rootNavigation.reset({
        index: 0,
        routes: [{ name: 'App' }],
      });
    } catch (error: any) {
      Alert.alert('Login Failed', error.message ?? 'Something went wrong.');
    }
  };

  const handleDevSignIn = async () => {
    try {
      await signIn(DEV_EMAIL, DEV_PASSWORD);
      rootNavigation.reset({
        index: 0,
        routes: [{ name: 'App' }],
      });
    } catch {
      // Account doesn't exist yet — create it
      try {
        await signUp(DEV_EMAIL, DEV_PASSWORD, 'Test User');
        rootNavigation.reset({
          index: 0,
          routes: [{ name: 'App' }],
        });
      } catch (error: any) {
        Alert.alert('Dev Sign In Failed', error.message ?? 'Something went wrong.');
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-warm-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <View className="mb-8">
          <Text className="text-3xl font-bold text-warm-800 mb-2">
            Welcome Back
          </Text>
          <Text className="text-base text-warm-400">
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
          <Text className="text-warm-400">Don't have an account? </Text>
          <Pressable onPress={() => navigation.navigate('Signup')}>
            <Text className="text-warm-700 font-semibold">Get Started</Text>
          </Pressable>
        </View>

        {__DEV__ && (
          <View className="mt-8 pt-6 border-t border-warm-200">
            <Button
              title="Dev Sign In"
              variant="ghost"
              size="sm"
              onPress={handleDevSignIn}
              loading={loading}
            />
            <Text className="text-xs text-warm-400 text-center mt-1">
              {DEV_EMAIL}
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
