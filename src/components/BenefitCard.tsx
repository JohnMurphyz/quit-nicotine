import { View, Text } from 'react-native';
import { useThemeColors } from '@/src/hooks/useThemeColors';

interface BenefitCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  progress: number; // 0-1
  isLast?: boolean;
}

export function BenefitCard({ title, description, icon, color, progress, isLast }: BenefitCardProps) {
  const colors = useThemeColors();
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const percentLabel = `${Math.round(clampedProgress * 100)}%`;

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, gap: 14 }}>
        {/* Icon circle */}
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 22 }}>{icon}</Text>
        </View>

        {/* Text + progress */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary }}>
              {title}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textMuted }}>
              {percentLabel}
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: colors.textMuted, marginBottom: 8, lineHeight: 17 }}>
            {description}
          </Text>

          {/* Progress bar */}
          <View
            style={{
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.isDark ? 'rgba(255,255,255,0.08)' : colors.borderColor,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                height: '100%',
                width: `${clampedProgress * 100}%`,
                borderRadius: 3,
                backgroundColor: color,
              }}
            />
          </View>
        </View>
      </View>

      {/* Divider */}
      {!isLast && (
        <View
          style={{
            height: 1,
            backgroundColor: colors.isDark ? 'rgba(255,255,255,0.06)' : colors.borderColor,
            marginLeft: 74,
          }}
        />
      )}
    </View>
  );
}
