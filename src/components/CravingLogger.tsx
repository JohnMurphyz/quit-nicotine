import { Modal, View, Text, Pressable, TextInput, ActionSheetIOS, Platform } from 'react-native';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { CravingTrigger } from '@/src/types';

const TRIGGERS: { value: CravingTrigger; label: string }[] = [
  { value: 'stress', label: 'Stress' },
  { value: 'boredom', label: 'Boredom' },
  { value: 'social', label: 'Social' },
  { value: 'after_meal', label: 'After meal' },
  { value: 'alcohol', label: 'Alcohol' },
  { value: 'morning', label: 'Morning' },
  { value: 'habit', label: 'Habit' },
  { value: 'other', label: 'Other' },
];

interface CravingLoggerProps {
  visible: boolean;
  onClose: () => void;
  onLog: (details?: {
    intensity?: number;
    trigger?: CravingTrigger;
    note?: string;
  }) => void;
  onOpenSOS: () => void;
  logging?: boolean;
}

export function CravingLogger({ visible, onClose, onLog, onOpenSOS, logging }: CravingLoggerProps) {
  const [intensity, setIntensity] = useState(5);
  const [trigger, setTrigger] = useState<CravingTrigger | null>(null);
  const [note, setNote] = useState('');
  const [triggerPickerVisible, setTriggerPickerVisible] = useState(false);

  const triggerLabel = trigger ? TRIGGERS.find(t => t.value === trigger)?.label : 'None';

  const openTriggerPicker = useCallback(() => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', ...TRIGGERS.map(t => t.label)],
          cancelButtonIndex: 0,
          title: 'What triggered this craving?',
        },
        (buttonIndex) => {
          if (buttonIndex === 0) return;
          setTrigger(TRIGGERS[buttonIndex - 1].value);
        }
      );
    } else {
      setTriggerPickerVisible(true);
    }
  }, []);

  const handleSubmit = () => {
    onLog({ intensity, trigger: trigger ?? undefined, note: note.trim() || undefined });
    setIntensity(5);
    setTrigger(null);
    setNote('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1 }} />

      {/* Bottom sheet */}
      <View style={{
        backgroundColor: '#faf7f4',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 44,
      }}>
        {/* Drag handle */}
        <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#d4c4b0', alignSelf: 'center', marginBottom: 20 }} />

        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <Pressable onPress={onClose} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="close" size={22} color="#8c7a66" />
          </Pressable>
          <Text style={{ fontSize: 17, fontWeight: '700', color: '#362d23' }}>Log a Craving</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Intensity */}
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#8c7a66', letterSpacing: 0.5, marginBottom: 10 }}>
          INTENSITY: {intensity}/10
        </Text>
        <View style={{ flexDirection: 'row', gap: 4, marginBottom: 24 }}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <Pressable
              key={n}
              onPress={() => setIntensity(n)}
              style={{
                flex: 1,
                height: 34,
                borderRadius: 6,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: n <= intensity ? '#f59e0b' : '#ebe1d4',
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '700', color: n <= intensity ? 'white' : '#b09a82' }}>
                {n}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Trigger — iOS-style select row */}
        <Pressable
          onPress={openTriggerPicker}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 15, color: '#362d23' }}>Trigger</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 15, color: '#8c7a66' }}>{triggerLabel}</Text>
            <Ionicons name="chevron-expand" size={15} color="#b09a82" />
          </View>
        </Pressable>

        {/* Android fallback picker */}
        {triggerPickerVisible && (
          <View style={{ backgroundColor: 'white', borderRadius: 12, marginBottom: 12, overflow: 'hidden' }}>
            {TRIGGERS.map((t, i) => (
              <Pressable
                key={t.value}
                onPress={() => { setTrigger(t.value); setTriggerPickerVisible(false); }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderTopWidth: i === 0 ? 0 : 1,
                  borderTopColor: '#ebe1d4',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ fontSize: 15, color: '#362d23' }}>{t.label}</Text>
                {trigger === t.value && <Ionicons name="checkmark" size={18} color="#6b5d4e" />}
              </Pressable>
            ))}
          </View>
        )}

        {/* Note */}
        <TextInput
          placeholder="Additional notes (optional)"
          value={note}
          onChangeText={setNote}
          style={{
            borderWidth: 1,
            borderColor: '#ebe1d4',
            borderRadius: 12,
            padding: 14,
            fontSize: 15,
            color: '#362d23',
            backgroundColor: 'white',
            marginBottom: 20,
            minHeight: 80,
            textAlignVertical: 'top',
          }}
          placeholderTextColor="#b09a82"
          multiline
        />

        {/* Submit */}
        <Pressable
          onPress={handleSubmit}
          disabled={logging}
          style={{
            backgroundColor: '#362d23',
            borderRadius: 14,
            padding: 17,
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
            {logging ? 'Logging…' : 'Submit'}
          </Text>
        </Pressable>

        <Pressable onPress={onOpenSOS} style={{ padding: 8, alignItems: 'center' }}>
          <Text style={{ color: '#ef4444', fontWeight: '600', fontSize: 14 }}>
            Need help right now? Open SOS
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}
