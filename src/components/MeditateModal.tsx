import { Modal, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BreathingExercise } from '@/src/components/BreathingExercise';

interface MeditateModalProps {
  visible: boolean;
  onClose: () => void;
}

export function MeditateModal({ visible, onClose }: MeditateModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#faf7f4' }}>
        {/* Close button */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, paddingTop: 8 }}>
          <Pressable
            onPress={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#ebe1d4',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="close" size={20} color="#6b5d4e" />
          </Pressable>
        </View>

        {/* Title */}
        <View style={{ alignItems: 'center', paddingTop: 24, paddingBottom: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#362d23', marginBottom: 4 }}>
            Breathe
          </Text>
          <Text style={{ fontSize: 15, color: '#8c7a66' }}>
            Follow the rhythm. Let go of tension.
          </Text>
        </View>

        {/* Breathing exercise */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <BreathingExercise />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
