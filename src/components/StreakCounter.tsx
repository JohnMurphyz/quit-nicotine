import { View, Text } from 'react-native';
import { Card } from './ui/Card';
import type { StreakData } from '@/src/types';

interface StreakCounterProps {
  streak: StreakData | null;
  loading: boolean;
}

export function StreakCounter({ streak, loading }: StreakCounterProps) {
  if (loading || !streak) {
    return (
      <Card className="items-center py-6">
        <Text className="text-gray-400 text-base">Loading streak...</Text>
      </Card>
    );
  }

  return (
    <View className="flex-row gap-4">
      <Card className="flex-1 items-center py-4">
        <Text className="text-4xl font-bold text-primary-600">
          {streak.current_streak}
        </Text>
        <Text className="text-sm text-gray-500 mt-1">Current Streak</Text>
      </Card>
      <Card className="flex-1 items-center py-4">
        <Text className="text-4xl font-bold text-gray-700">
          {streak.longest_streak}
        </Text>
        <Text className="text-sm text-gray-500 mt-1">Longest Streak</Text>
      </Card>
    </View>
  );
}
