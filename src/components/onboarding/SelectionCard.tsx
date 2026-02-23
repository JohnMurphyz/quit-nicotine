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
      style={{
        backgroundColor: selected
          ? 'rgba(124,58,237,0.3)'
          : 'rgba(160,150,220,0.08)',
        borderWidth: 1,
        borderColor: selected
          ? '#7c3aed'
          : 'rgba(160,150,220,0.18)',
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 24,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: '500',
          textAlign: 'center',
          color: selected
            ? '#ffffff'
            : dimmed
              ? 'rgba(255,255,255,0.3)'
              : 'rgba(255,255,255,0.9)',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
