import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProgressBarProps {
  step: number;
  totalSteps: number;
  onBack?: () => void;
}

export function ProgressBar({ step, totalSteps, onBack }: ProgressBarProps) {
  return (
    <View className="flex-row items-center px-6 pt-2 pb-4">
      {onBack && (
        <Pressable onPress={onBack} className="mr-3 -ml-1">
          <Ionicons name="chevron-back" size={24} color="#8c7a66" />
        </Pressable>
      )}
      <View className="flex-1 flex-row">
        {Array.from({ length: totalSteps }, (_, i) => (
          <View
            key={i}
            className={`flex-1 h-1 rounded-full mx-0.5 ${
              i < step ? 'bg-warm-500' : 'bg-warm-200'
            }`}
          />
        ))}
      </View>
    </View>
  );
}
