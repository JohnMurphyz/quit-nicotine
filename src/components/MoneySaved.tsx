import { View, Text } from 'react-native';
import { useMemo } from 'react';
import { differenceInDays } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

interface MoneySavedProps {
  quitDate: string | null;
  dailyCost: number | null;
}

export function MoneySaved({ quitDate, dailyCost }: MoneySavedProps) {
  const saved = useMemo(() => {
    if (!quitDate || !dailyCost) return 0;
    const days = differenceInDays(new Date(), new Date(quitDate));
    return Math.max(0, days * dailyCost);
  }, [quitDate, dailyCost]);

  if (!quitDate || !dailyCost) return null;

  return (
    <View className="bg-emerald-50 rounded-2xl p-4 flex-row items-center">
      <View className="w-12 h-12 rounded-full bg-emerald-100 items-center justify-center mr-3">
        <Ionicons name="wallet" size={24} color="#059669" />
      </View>
      <View>
        <Text className="text-sm text-emerald-600 font-medium">Money Saved</Text>
        <Text className="text-2xl font-bold text-emerald-700">
          ${saved.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}
