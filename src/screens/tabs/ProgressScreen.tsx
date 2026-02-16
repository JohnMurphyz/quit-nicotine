import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStreak } from '@/src/hooks/useStreak';
import { StreakCalendar } from '@/src/components/StreakCalendar';
import { StreakCounter } from '@/src/components/StreakCounter';
import { Card } from '@/src/components/ui/Card';

export default function ProgressScreen() {
  const { streak, confirmations, loading } = useStreak();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 pt-6 pb-12">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Your Progress
        </Text>

        <StreakCounter streak={streak} loading={loading} />

        <View className="mt-6">
          <StreakCalendar confirmations={confirmations} />
        </View>

        <View className="mt-6 flex-row gap-4">
          <Card className="flex-1 items-center py-4">
            <Text className="text-2xl font-bold text-gray-700">
              {confirmations.length}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">Total Days</Text>
          </Card>
          <Card className="flex-1 items-center py-4">
            <Text className="text-2xl font-bold text-gray-700">
              {streak?.longest_streak ?? 0}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">Best Streak</Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
