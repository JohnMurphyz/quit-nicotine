import { View, Text, Pressable } from 'react-native';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { getSymptomsForKeys } from '@/src/constants/symptoms';
import { BenefitCard } from '@/src/components/BenefitCard';

interface SymptomRecoveryListProps {
  trackedSymptoms: string[];
  daysFree: number;
  onEdit?: () => void;
}

export function SymptomRecoveryList({ trackedSymptoms, daysFree, onEdit }: SymptomRecoveryListProps) {
  const colors = useThemeColors();
  const symptoms = getSymptomsForKeys(trackedSymptoms);

  if (symptoms.length === 0) return null;

  return (
    <View style={{ marginBottom: 24 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>
          Your Symptoms
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
        {symptoms.map((s, i) => {
          const progress = Math.min(Math.max(daysFree / s.recoveryDays, 0), 1);
          const description = progress >= 1 ? 'Recovered!' : s.recoveryLabel;
          return (
            <BenefitCard
              key={s.key}
              title={s.title}
              description={description}
              icon={s.icon}
              color={s.color}
              progress={progress}
              isLast={i === symptoms.length - 1}
            />
          );
        })}
      </View>
    </View>
  );
}
