import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AchievementDef } from '@/src/constants/achievements';

interface AchievementBadgeProps {
  achievement: AchievementDef;
  unlocked: boolean;
}

export function AchievementBadge({ achievement, unlocked }: AchievementBadgeProps) {
  return (
    <View
      className={`items-center p-3 rounded-2xl ${
        unlocked ? 'bg-amber-50' : 'bg-warm-50'
      }`}
      style={{ width: '30%' }}
    >
      <View
        className={`w-14 h-14 rounded-full items-center justify-center mb-2 ${
          unlocked ? 'bg-amber-100' : 'bg-warm-200'
        }`}
      >
        <Ionicons
          name={achievement.icon as any}
          size={28}
          color={unlocked ? '#d97706' : '#d4c4b0'}
        />
      </View>
      <Text
        className={`text-xs font-medium text-center ${
          unlocked ? 'text-warm-700' : 'text-warm-300'
        }`}
        numberOfLines={2}
      >
        {achievement.title}
      </Text>
    </View>
  );
}
