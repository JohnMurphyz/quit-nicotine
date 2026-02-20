import { useThemeColors } from '@/src/hooks/useThemeColors';
import { supabase } from '@/src/lib/supabase';
import { useAuthStore } from '@/src/stores/authStore';
import { useStreakStore } from '@/src/stores/streakStore';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type WhenOption = 'now' | 'today' | 'yesterday';

interface RelapseModalProps {
  visible: boolean;
  onClose: () => void;
  onReset: () => Promise<void>;
}

export function RelapseModal({ visible, onClose, onReset }: RelapseModalProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, updateProfile } = useAuthStore();
  const { fetchStreak, fetchConfirmations } = useStreakStore();
  const [selected, setSelected] = useState<WhenOption>('now');
  const [loading, setLoading] = useState(false);

  const options: { key: WhenOption; label: string }[] = [
    { key: 'now', label: 'Just Now' },
    { key: 'today', label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
  ];

  const getRelapseDate = (): string => {
    const now = new Date();
    if (selected === 'now') return now.toISOString();
    if (selected === 'today') {
      now.setHours(0, 0, 0, 0);
      return now.toISOString();
    }
    now.setDate(now.getDate() - 1);
    now.setHours(0, 0, 0, 0);
    return now.toISOString();
  };

  const handleClose = () => {
    setSelected('now');
    onClose();
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      await updateProfile({ quit_date: getRelapseDate() });

      if (user?.id) {
        await supabase.from('streak_confirmations').delete().eq('user_id', user.id);
        await fetchStreak(user.id);
        await fetchConfirmations(user.id);
      }

      await onReset();

      handleClose();
      setTimeout(() => {
        navigation.navigate('RelapseWizard' as never);
      }, 300);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const borderColor = colors.isDark ? 'rgba(160,150,220,0.18)' : colors.borderColor;
  const cardBg = colors.isDark ? 'rgba(20,18,48,0.97)' : '#f5efe8';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable
        style={{ flex: 1, justifyContent: 'flex-end' }}
        onPress={handleClose}
      >
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: cardBg,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderWidth: 1,
            borderColor,
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: insets.bottom + 16,
          }}
        >
          {/* Handle bar */}
          <View style={{
            width: 40, height: 4, borderRadius: 2,
            backgroundColor: colors.isDark ? 'rgba(160,150,220,0.3)' : 'rgba(140,122,102,0.3)',
            alignSelf: 'center', marginBottom: 28,
          }} />

          <Text style={{
            fontSize: 26, fontWeight: '800',
            color: colors.textPrimary,
            textAlign: 'center',
            lineHeight: 34,
            marginBottom: 32,
          }}>
            No worries.{'\n'}When did you relapse?
          </Text>

          <View style={{ gap: 10, marginBottom: 28 }}>
            {options.map(({ key, label }) => {
              const isSelected = selected === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setSelected(key)}
                  activeOpacity={0.7}
                  style={{
                    borderRadius: 14,
                    paddingVertical: 16,
                    alignItems: 'center',
                    backgroundColor: isSelected
                      ? colors.textSecondary
                      : (colors.isDark ? 'rgba(160,150,220,0.08)' : 'rgba(140,122,102,0.07)'),
                    borderWidth: 2,
                    borderColor: isSelected ? colors.textSecondary : borderColor,
                  }}
                >
                  <Text style={{
                    fontSize: 17, fontWeight: '700',
                    color: isSelected ? colors.textPrimary : colors.textMuted,
                  }}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            onPress={handleContinue}
            activeOpacity={0.85}
            disabled={loading}
            style={{
              borderRadius: 14, paddingVertical: 17,
              alignItems: 'center',
              backgroundColor: '#3b82f6',
              borderWidth: 2,
              borderColor: '#60a5fa',
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>
              {loading ? 'Saving…' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
