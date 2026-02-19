import { Modal, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/src/hooks/useThemeColors';

interface MoreSheetProps {
  visible: boolean;
  onClose: () => void;
  onLogCraving: () => void;
  onOpenJournal: () => void;
  onOpenProfile: () => void;
  onOpenAccountability: () => void;
}

const ITEMS: { icon: string; label: string; key: 'onLogCraving' | 'onOpenJournal' | 'onOpenAccountability' | 'onOpenProfile' }[] = [
  { icon: 'flash', label: 'Log a Craving', key: 'onLogCraving' },
  { icon: 'book', label: 'Journal', key: 'onOpenJournal' },
  { icon: 'people', label: 'Accountability', key: 'onOpenAccountability' },
  { icon: 'person', label: 'Profile', key: 'onOpenProfile' },
];

export function MoreSheet({ visible, onClose, onLogCraving, onOpenJournal, onOpenProfile, onOpenAccountability }: MoreSheetProps) {
  const callbacks = { onLogCraving, onOpenJournal, onOpenProfile, onOpenAccountability };
  const colors = useThemeColors();

  // Always light-themed so it contrasts against the dark sky
  const sheetBg = '#faf7f4';
  const handleColor = '#d4c4b0';
  const dividerColor = '#ebe1d4';
  const outlineColor = 'rgba(140,122,102,0.25)';
  const iconColor = '#8c7a66';
  const labelColor = '#362d23';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={{ flex: 1 }} onPress={onClose} />

      <View
        style={{
          backgroundColor: sheetBg,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 44,
        }}
      >
        {/* Drag handle */}
        <View
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: handleColor,
            alignSelf: 'center',
            marginBottom: 20,
          }}
        />

        {ITEMS.map((item, i) => (
          <Pressable
            key={item.key}
            onPress={() => {
              callbacks[item.key]();
              onClose();
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              paddingVertical: 16,
              borderTopWidth: i === 0 ? 0 : 1,
              borderTopColor: dividerColor,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                borderWidth: 1.5,
                borderColor: outlineColor,
                backgroundColor: 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name={item.icon as any} size={20} color={iconColor} />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: labelColor }}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </Modal>
  );
}
