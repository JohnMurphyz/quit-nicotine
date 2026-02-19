import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import type { TimelineItem as TimelineItemType } from '@/src/hooks/useTimeline';

interface TimelineItemProps {
  item: TimelineItemType;
  isLast?: boolean;
}

export function TimelineItemRow({ item, isLast }: TimelineItemProps) {
  const colors = useThemeColors();

  const dotBg = item.passed
    ? (colors.isDark ? 'rgba(196,181,253,0.15)' : 'rgba(90,74,62,0.1)')
    : colors.cardBg;
  const dotIcon = item.passed ? colors.textSecondary : colors.textMuted;
  const lineBg = item.passed
    ? (colors.isDark ? 'rgba(196,181,253,0.25)' : 'rgba(90,74,62,0.15)')
    : (colors.isDark ? colors.borderColor : '#ede5db');

  return (
    <View className="flex-row">
      {/* Timeline line and dot */}
      <View className="items-center mr-4" style={{ width: 32 }}>
        <View
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{ backgroundColor: dotBg }}
        >
          <Ionicons
            name={item.passed ? 'checkmark' : (item.icon as any)}
            size={16}
            color={dotIcon}
          />
        </View>
        {!isLast && (
          <View
            style={{ width: 2, flex: 1, backgroundColor: lineBg }}
          />
        )}
      </View>

      {/* Content */}
      <View className={`flex-1 pb-6 ${item.passed ? '' : 'opacity-50'}`}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: item.passed ? colors.textPrimary : colors.textMuted,
          }}
        >
          {item.title}
        </Text>
        <Text style={{ fontSize: 14, color: colors.textMuted, marginTop: 4 }}>
          {item.description}
        </Text>
        {item.passed && item.unlockedAt && (
          <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
            Unlocked {format(item.unlockedAt, 'MMM d, yyyy')}
          </Text>
        )}
      </View>
    </View>
  );
}
