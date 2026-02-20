import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { BreathingExercise } from '@/src/components/BreathingExercise';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MeditateModalProps {
  visible: boolean;
  onClose: () => void;
}

export function MeditateModal({ visible, onClose }: MeditateModalProps) {
  const colors = useThemeColors();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <AnimatedSkyBackground>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          {/* Header with Chevron Back */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 20, paddingTop: 16 }}>
            <Pressable
              onPress={onClose}
              style={{
                backgroundColor: colors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                width: 40, height: 40, borderRadius: 20,
                alignItems: 'center', justifyContent: 'center'
              }}
            >
              <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
            </Pressable>
          </View>

          {/* Title */}
          <View style={{ alignItems: 'center', paddingTop: 24, paddingBottom: 16 }}>
            <Text style={{ fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 }}>
              Breathe
            </Text>
            <Text style={{ fontSize: 16, color: colors.textSecondary }}>
              Follow the rhythm. Let go of tension.
            </Text>
          </View>

          {/* Breathing exercise */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <BreathingExercise />
          </View>
        </SafeAreaView>
      </AnimatedSkyBackground>
    </Modal>
  );
}
