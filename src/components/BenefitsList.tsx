import { View, Text, Pressable } from 'react-native';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { getBenefitsForMotivations } from '@/src/constants/benefits';
import { BenefitCard } from '@/src/components/BenefitCard';

interface BenefitsListProps {
  motivations: string[];
  daysFree: number;
  onEdit?: () => void;
}

export function BenefitsList({ motivations, daysFree, onEdit }: BenefitsListProps) {
  const colors = useThemeColors();
  const benefits = getBenefitsForMotivations(motivations);

  if (benefits.length === 0) return null;

  return (
    <View style={{ marginBottom: 24 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>
          Your Goals
        </Text>
        {onEdit && (
          <Pressable onPress={onEdit} hitSlop={8}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textMuted }}>Edit</Text>
          </Pressable>
        )}
      </View>
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.isDark ? 'rgba(160,150,220,0.2)' : colors.borderColor,
          borderRadius: 16,
          backgroundColor: colors.isDark ? 'rgba(160,150,220,0.06)' : colors.cardBg,
          overflow: 'hidden',
        }}
      >
        {benefits.map((b, i) => (
          <BenefitCard
            key={b.key}
            title={b.title}
            description={b.description}
            icon={b.icon}
            color={b.color}
            progress={Math.min(daysFree / b.timelineDays, 1)}
            isLast={i === benefits.length - 1}
          />
        ))}
      </View>
    </View>
  );
}
