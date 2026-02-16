import { View, Text, ScrollView, Switch, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '@/src/stores/authStore';
import { useNotifications } from '@/src/hooks/useNotifications';
import { useSubscription } from '@/src/hooks/useSubscription';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { InviteLinkCard } from '@/src/components/InviteLinkCard';
import type { AppStackParamList } from '@/src/navigation/types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const { profile, signOut } = useAuthStore();
  const { enabled, toggleNotifications } = useNotifications();
  const { status } = useSubscription();

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 pt-6 pb-12">
        <Text className="text-2xl font-bold text-gray-900 mb-6">Settings</Text>

        {/* Account */}
        <Text className="text-sm font-medium text-gray-500 uppercase mb-2">
          Account
        </Text>
        <Card className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-600">Email</Text>
            <Text className="text-gray-800">{profile?.email}</Text>
          </View>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-600">Name</Text>
            <Text className="text-gray-800">
              {profile?.display_name ?? '-'}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">Timezone</Text>
            <Text className="text-gray-800">{profile?.timezone}</Text>
          </View>
        </Card>

        {/* Subscription */}
        <Text className="text-sm font-medium text-gray-500 uppercase mb-2">
          Subscription
        </Text>
        <Card className="mb-6">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">Status</Text>
            <Text
              className={`font-medium ${
                status === 'active' || status === 'trial'
                  ? 'text-primary-600'
                  : 'text-gray-800'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </View>
        </Card>

        {/* Notifications */}
        <Text className="text-sm font-medium text-gray-500 uppercase mb-2">
          Notifications
        </Text>
        <Card className="mb-6">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">Daily Reminder</Text>
            <Switch
              value={enabled}
              onValueChange={toggleNotifications}
              trackColor={{ true: '#22c55e', false: '#d1d5db' }}
            />
          </View>
        </Card>

        {/* Accountability */}
        <Text className="text-sm font-medium text-gray-500 uppercase mb-2">
          Accountability
        </Text>
        {profile?.invite_code && (
          <InviteLinkCard inviteCode={profile.invite_code} />
        )}
        <Pressable onPress={() => navigation.navigate('Accountability')}>
          <Card className="mb-6">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-800 font-medium">
                Manage Partners
              </Text>
              <Text className="text-gray-400 text-lg">›</Text>
            </View>
          </Card>
        </Pressable>

        {/* Sign Out */}
        <View className="mt-4">
          <Button
            title="Sign Out"
            variant="outline"
            onPress={handleSignOut}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
