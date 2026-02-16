import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { useStreak } from '@/src/hooks/useStreak';
import { useAuthStore } from '@/src/stores/authStore';
import { StreakButton } from '@/src/components/StreakButton';
import { StreakCounter } from '@/src/components/StreakCounter';

export default function HomeScreen() {
  const { user, profile } = useAuthStore();
  const { streak, loading, confirming, confirmToday, fetchStreak } = useStreak();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    if (!user?.id) return;
    setRefreshing(true);
    await fetchStreak(user.id);
    setRefreshing(false);
  }, [user?.id]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="items-center px-4 pt-8 pb-12"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text className="text-2xl font-bold text-gray-900 mb-1">
          Hey, {profile?.display_name ?? 'there'}
        </Text>
        <Text className="text-base text-gray-500 mb-8">
          {streak?.confirmed_today
            ? "You're doing great! See you tomorrow."
            : 'Ready to confirm your nicotine-free day?'}
        </Text>

        <View className="mb-8">
          <StreakButton
            confirmedToday={streak?.confirmed_today ?? false}
            confirming={confirming}
            onConfirm={confirmToday}
          />
        </View>

        <View className="w-full">
          <StreakCounter streak={streak} loading={loading} />
        </View>

        {streak && streak.current_streak > 0 && (
          <View className="mt-6 bg-primary-50 rounded-2xl p-4 w-full">
            <Text className="text-primary-800 text-center text-base">
              {streak.current_streak === 1
                ? 'Day 1 - Every journey starts with a single step!'
                : streak.current_streak < 7
                ? `${streak.current_streak} days strong! Keep going!`
                : streak.current_streak < 30
                ? `${streak.current_streak} days! You're building a real habit!`
                : `${streak.current_streak} days! You're an inspiration!`}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
