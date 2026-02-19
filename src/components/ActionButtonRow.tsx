import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/src/hooks/useThemeColors';

interface ActionButton {
  icon: string;
  label: string;
  onPress: () => void;
  completed?: boolean;
  bgColor?: string;
  iconColor?: string;
}

interface ActionButtonRowProps {
  buttons: ActionButton[];
}

export function ActionButtonRow({ buttons }: ActionButtonRowProps) {
  const colors = useThemeColors();

  // Muted lavender outline tones
  const borderColor = colors.isDark ? 'rgba(160,150,220,0.3)' : 'rgba(140,122,102,0.25)';
  const iconColor = colors.isDark ? '#8580a8' : '#8c7a66';
  const completedIconColor = colors.isDark ? '#a898d8' : '#6b5d4e';
  const labelColor = colors.textMuted;

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingVertical: 12 }}>
      {buttons.map((btn) => (
        <Pressable
          key={btn.label}
          onPress={btn.onPress}
          style={{ alignItems: 'center' }}
        >
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              borderWidth: 1.5,
              borderColor: btn.completed ? completedIconColor : borderColor,
              backgroundColor: 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 6,
            }}
          >
            <Ionicons
              name={(btn.completed ? 'checkmark' : btn.icon) as any}
              size={22}
              color={btn.completed ? completedIconColor : (btn.iconColor ?? iconColor)}
            />
          </View>
          <Text style={{ fontSize: 12, color: labelColor, fontWeight: '500' }}>
            {btn.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
