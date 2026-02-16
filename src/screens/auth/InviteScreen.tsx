import { useState, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/src/lib/supabase';
import { useAuthStore } from '@/src/stores/authStore';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import type { AuthStackParamList } from '@/src/navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Invite'>;
type InviteRoute = RouteProp<AuthStackParamList, 'Invite'>;

export default function InviteScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<InviteRoute>();
  const { code } = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [inviterName, setInviterName] = useState<string | null>(null);
  const [inviterUserId, setInviterUserId] = useState<string | null>(null);
  const [loadingInvite, setLoadingInvite] = useState(true);
  const { loading } = useAuthStore();

  useEffect(() => {
    lookupInvite();
  }, [code]);

  const lookupInvite = async () => {
    if (!code) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name')
      .eq('invite_code', code)
      .single();

    if (error || !data) {
      setLoadingInvite(false);
      return;
    }

    setInviterName(data.display_name);
    setInviterUserId(data.id);
    setLoadingInvite(false);
  };

  const handleGuestSignup = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in email and password.');
      return;
    }

    if (!inviterUserId) {
      Alert.alert('Error', 'Invalid invite link.');
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });

      if (authError) throw authError;

      const guestId = authData.user?.id;
      if (!guestId) throw new Error('Signup failed');

      await new Promise((resolve) => setTimeout(resolve, 1500));

      await supabase
        .from('profiles')
        .update({
          role: 'guest',
          linked_to: inviterUserId,
        })
        .eq('id', guestId);

      await supabase.from('accountability_partners').insert({
        user_id: inviterUserId,
        partner_id: guestId,
        status: 'active',
      });

      // Auth state listener in useAuth will auto-navigate to App stack
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message ?? 'Something went wrong.');
    }
  };

  if (loadingInvite) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-gray-500 mt-4">Loading invite...</Text>
      </SafeAreaView>
    );
  }

  if (!inviterUserId) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-xl font-bold text-gray-900 mb-2">
          Invalid Invite
        </Text>
        <Text className="text-gray-500 text-center mb-6">
          This invite link is invalid or has expired.
        </Text>
        <Button
          title="Go to Login"
          onPress={() => navigation.navigate('Login')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            You're Invited!
          </Text>
          <Text className="text-base text-gray-500">
            {inviterName ?? 'Someone'} wants you to be their accountability
            partner. Sign up to track their nicotine-free progress.
          </Text>
        </View>

        <Input
          label="Display Name"
          placeholder="Your name"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
        />

        <Input
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Password"
          placeholder="Choose a password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title="Join as Accountability Partner"
          onPress={handleGuestSignup}
          loading={loading}
          size="lg"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
