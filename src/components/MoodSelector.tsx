import { View, Text, Pressable } from 'react-native';
import type { Mood } from '@/src/types';

const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: 'great', emoji: '😄', label: 'Great' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'rough', emoji: '😟', label: 'Rough' },
  { value: 'terrible', emoji: '😢', label: 'Terrible' },
];

interface MoodSelectorProps {
  selected: Mood | null;
  onSelect: (mood: Mood) => void;
}

export function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <View className="flex-row justify-between">
      {MOODS.map((mood) => (
        <Pressable
          key={mood.value}
          onPress={() => onSelect(mood.value)}
          className={`items-center px-3 py-2 rounded-xl ${
            selected === mood.value ? 'bg-warm-200' : ''
          }`}
        >
          <Text className="text-2xl mb-1">{mood.emoji}</Text>
          <Text
            className={`text-xs font-medium ${
              selected === mood.value ? 'text-warm-700' : 'text-gray-500'
            }`}
          >
            {mood.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export function getMoodEmoji(mood: Mood): string {
  return MOODS.find((m) => m.value === mood)?.emoji ?? '😐';
}
