import { Text, Pressable } from 'react-native';

interface SelectionCardProps {
  label: string;
  selected: boolean;
  dimmed: boolean;
  onPress: () => void;
}

export function SelectionCard({ label, selected, dimmed, onPress }: SelectionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-2xl py-5 px-6 ${
        selected ? 'bg-warm-500' : 'bg-warm-100'
      }`}
    >
      <Text
        className={`text-lg font-medium text-center ${
          selected
            ? 'text-white'
            : dimmed
              ? 'text-warm-300'
              : 'text-warm-800'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
