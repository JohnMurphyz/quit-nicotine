import { View, Text } from 'react-native';
import { subDays, format, isSameDay, isAfter } from 'date-fns';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import type { StreakConfirmation } from '@/src/types';

interface DayStreakRowProps {
  confirmations: StreakConfirmation[];
}

export function DayStreakRow({ confirmations }: DayStreakRowProps) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
  const confirmedSet = new Set(confirmations.map(c => c.confirmed_date));
  const colors = useThemeColors();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
      {days.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const isConfirmed = confirmedSet.has(dateStr);
        const isToday = isSameDay(day, today);
        const isFuture = isAfter(day, today);
        const letter = format(day, 'EEEEE');

        let borderColor: string;
        let symbol: string;
        let symbolColor: string;

        const outlineColor = colors.isDark ? 'rgba(160,150,220,0.3)' : 'rgba(140,122,102,0.25)';

        if (isConfirmed) {
          borderColor = outlineColor;
          symbol = '✓';
          symbolColor = colors.textSecondary;
        } else if (isToday || isFuture) {
          borderColor = outlineColor;
          symbol = '–';
          symbolColor = colors.textMuted;
        } else {
          borderColor = outlineColor;
          symbol = '✕';
          symbolColor = colors.textSecondary;
        }

        return (
          <View key={dateStr} style={{ alignItems: 'center', gap: 4 }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderColor: borderColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{ color: symbolColor, fontSize: 16, fontWeight: '700', lineHeight: 20 }}>
                {symbol}
              </Text>
            </View>
            <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: '500' }}>{letter}</Text>
          </View>
        );
      })}
    </View>
  );
}
