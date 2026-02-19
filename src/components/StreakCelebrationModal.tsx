import { Modal, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { FlameIcon } from '@/src/components/FlameIcon';
import { useThemeColors } from '@/src/hooks/useThemeColors';

interface StreakCelebrationModalProps {
  visible: boolean;
  onClose: () => void;
  streakCount: number;
}

export function StreakCelebrationModal({ visible, onClose, streakCount }: StreakCelebrationModalProps) {
  const colors = useThemeColors();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <AnimatedSkyBackground>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Close button */}
          <View style={{ alignItems: 'flex-start', paddingHorizontal: 16, paddingTop: 20 }}>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={26} color={colors.textPrimary} />
            </Pressable>
          </View>

          {/* Center content */}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
            <FlameIcon size={120} active />

            <Text
              style={{
                fontSize: 40,
                fontWeight: '800',
                color: colors.textPrimary,
                textAlign: 'center',
                marginTop: 24,
              }}
            >
              {streakCount} Day Streak
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: colors.textMuted,
                textAlign: 'center',
                lineHeight: 24,
                marginTop: 12,
                paddingHorizontal: 16,
              }}
            >
              Gain a streak for every consecutive day you pledge to stay nicotine-free.
            </Text>
          </View>

          {/* Continue button */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
            <Pressable
              onPress={onClose}
              style={{
                backgroundColor: '#faf7f4',
                borderRadius: 16,
                padding: 17,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#362d23', fontWeight: '700', fontSize: 16 }}>
                Keep it up!
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </AnimatedSkyBackground>
    </Modal>
  );
}
