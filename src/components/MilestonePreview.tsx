import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import type { TimelineItem } from '@/src/hooks/useTimeline';

interface MilestonePreviewProps {
  milestone: TimelineItem | null;
}

function formatTimeRemaining(minutes: number): string {
  if (minutes < 60) return `${Math.ceil(minutes)} minutes`;
  if (minutes < 24 * 60) return `${Math.ceil(minutes / 60)} hours`;
  const days = Math.ceil(minutes / (24 * 60));
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  const months = Math.round(days / 30);
  if (months === 1) return '1 month';
  if (months < 12) return `${months} months`;
  const years = Math.round(days / 365);
  return `${years} year${years > 1 ? 's' : ''}`;
}

export function MilestonePreview({ milestone }: MilestonePreviewProps) {
  const colors = useThemeColors();

  if (!milestone) return null;

  return (
    <View
      className="rounded-2xl p-4 flex-row items-center"
      style={{
        backgroundColor: colors.isDark ? colors.cardBg : '#f5f3ff',
        borderWidth: colors.isDark ? 1 : 0,
        borderColor: colors.borderColor,
      }}
    >
      <View
        className="w-12 h-12 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: colors.isDark ? 'rgba(124,58,237,0.15)' : '#ede9fe' }}
      >
        <Ionicons name={milestone.icon as any} size={24} color="#7c3aed" />
      </View>
      <View className="flex-1">
        <Text style={{ fontSize: 14, fontWeight: '500', color: colors.isDark ? '#a78bfa' : '#7c3aed' }}>
          Next Milestone
        </Text>
        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary }}>
          {milestone.title}
        </Text>
        <Text style={{ fontSize: 14, color: colors.isDark ? '#8580a8' : '#8b5cf6' }}>
          {formatTimeRemaining(milestone.minutesRemaining)} to go
        </Text>
      </View>
    </View>
  );
}
