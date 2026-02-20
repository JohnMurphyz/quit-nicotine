import { useThemeColors } from '@/src/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, Text, View } from 'react-native';

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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} onPress={onClose} />

      <View
        style={{
          backgroundColor: colors.cardBg,
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
            backgroundColor: colors.borderColor,
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
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              paddingVertical: 16,
              borderTopWidth: i === 0 ? 0 : 1,
              borderTopColor: colors.borderColor,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                borderWidth: 1.5,
                borderColor: colors.borderColor,
                backgroundColor: 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name={item.icon as any} size={20} color={colors.textSecondary} />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary }}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </Modal>
  );
}
