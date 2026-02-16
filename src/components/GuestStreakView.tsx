import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useStreak } from '@/src/hooks/useStreak';
import { StreakCounter } from './StreakCounter';
import { StreakCalendar } from './StreakCalendar';

interface GuestStreakViewProps {
  userId: string;
  displayName: string | null;
}

export function GuestStreakView({ userId, displayName }: GuestStreakViewProps) {
  const { streak, confirmations, loading } = useStreak(userId);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-6">
      <Text className="text-2xl font-bold text-gray-800 mb-1">
        {displayName ?? 'User'}'s Progress
      </Text>
      <Text className="text-sm text-gray-500 mb-6">
        You're tracking their nicotine-free journey
      </Text>

      <StreakCounter streak={streak} loading={loading} />

      <View className="mt-6">
        <StreakCalendar confirmations={confirmations} />
      </View>
    </ScrollView>
  );
}
