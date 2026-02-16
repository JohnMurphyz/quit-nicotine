import { Pressable, Text, View } from 'react-native';
import { Platform } from 'react-native';

interface StreakButtonProps {
  confirmedToday: boolean;
  confirming: boolean;
  onConfirm: () => void;
}

export function StreakButton({
  confirmedToday,
  confirming,
  onConfirm,
}: StreakButtonProps) {
  const handlePress = async () => {
    if (confirmedToday || confirming) return;

    if (Platform.OS !== 'web') {
      const Haptics = await import('expo-haptics');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    onConfirm();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={confirmedToday || confirming}
      className={`w-48 h-48 rounded-full items-center justify-center shadow-lg ${
        confirmedToday
          ? 'bg-primary-500'
          : confirming
          ? 'bg-primary-300'
          : 'bg-primary-600 active:bg-primary-700 active:scale-95'
      }`}
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed && !confirmedToday ? 0.95 : 1 }],
        },
      ]}
    >
      <View className="items-center">
        {confirmedToday ? (
          <>
            <Text className="text-4xl mb-1">✓</Text>
            <Text className="text-white text-lg font-bold">Confirmed</Text>
            <Text className="text-white/80 text-sm">Nicotine-free today</Text>
          </>
        ) : (
          <>
            <Text className="text-white text-lg font-bold text-center px-4">
              I didn't use nicotine today
            </Text>
            {confirming && (
              <Text className="text-white/80 text-sm mt-1">Confirming...</Text>
            )}
          </>
        )}
      </View>
    </Pressable>
  );
}
