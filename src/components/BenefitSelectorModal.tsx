import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useAuthStore } from '@/src/stores/authStore';
import { BENEFITS } from '@/src/constants/benefits';

interface BenefitSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  initialSelections?: string[];
}

export function BenefitSelectorModal({ visible, onClose, initialSelections }: BenefitSelectorModalProps) {
  const colors = useThemeColors();
  const { updateProfile } = useAuthStore();
  const [selected, setSelected] = useState<string[]>(initialSelections ?? []);
  const [saving, setSaving] = useState(false);

  const toggle = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ motivations: selected });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  // Reset selections when modal opens
  const handleShow = () => {
    setSelected(initialSelections ?? []);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
      onShow={handleShow}
    >
      <AnimatedSkyBackground>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 36, paddingBottom: 12 }}>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={26} color={colors.textPrimary} />
            </Pressable>
            <Text style={{ fontSize: 17, fontWeight: '700', color: colors.textPrimary }}>
              Choose your goals
            </Text>
            <View style={{ width: 26 }} />
          </View>

          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={{ fontSize: 15, color: colors.textMuted, marginBottom: 20, lineHeight: 21 }}>
              Select the goals you wish to track during your recovery.
            </Text>

            {/* Goal cards */}
            <View style={{ gap: 10 }}>
              {BENEFITS.map((benefit) => {
                const isSelected = selected.includes(benefit.key);
                return (
                  <Pressable
                    key={benefit.key}
                    onPress={() => toggle(benefit.key)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: benefit.color,
                      borderRadius: 16,
                      paddingVertical: 18,
                      paddingHorizontal: 16,
                      opacity: isSelected ? 1 : 0.55,
                      gap: 14,
                    }}
                  >
                    {/* Emoji icon in circle */}
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 20 }}>{benefit.icon}</Text>
                    </View>

                    {/* Title */}
                    <Text style={{ flex: 1, fontSize: 16, fontWeight: '700', color: '#ffffff' }}>
                      {benefit.title}
                    </Text>

                    {/* Checkmark */}
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: isSelected ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.3)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={18} color={benefit.color} />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ flex: 1, minHeight: 24 }} />
          </ScrollView>

          {/* Save button */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
            <Pressable
              onPress={handleSave}
              disabled={saving || selected.length === 0}
              style={{
                backgroundColor: '#faf7f4',
                borderRadius: 16,
                padding: 17,
                alignItems: 'center',
                opacity: selected.length === 0 ? 0.5 : 1,
              }}
            >
              <Text style={{ color: '#362d23', fontWeight: '700', fontSize: 16 }}>
                {saving ? 'Saving...' : 'Track these goals'}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </AnimatedSkyBackground>
    </Modal>
  );
}
