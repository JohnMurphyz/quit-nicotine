import { Modal, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { MILESTONES } from '@/src/components/JourneyBar';

interface MilestoneCelebrationModalProps {
  visible: boolean;
  onClose: () => void;
  daysFree: number;
  minutesSinceQuit: number;
}

export function MilestoneCelebrationModal({ visible, onClose, daysFree, minutesSinceQuit }: MilestoneCelebrationModalProps) {
  const colors = useThemeColors();

  // Find the last reached milestone and the next one
  const lastReachedIdx = [...MILESTONES].reverse().findIndex((m) => minutesSinceQuit >= m.minutes);
  const lastReached = lastReachedIdx !== -1 ? MILESTONES[MILESTONES.length - 1 - lastReachedIdx] : null;
  const nextIdx = MILESTONES.findIndex((m) => minutesSinceQuit < m.minutes);
  const next = nextIdx !== -1 ? MILESTONES[nextIdx] : null;

  const allComplete = nextIdx === -1;

  // Title: show last reached milestone or "Just Started"
  const title = allComplete
    ? 'All Milestones Complete!'
    : lastReached
    ? lastReached.label
    : 'Day 1';

  const description = allComplete
    ? "You've passed every major recovery milestone. Your body has healed remarkably."
    : lastReached
    ? lastReached.description
    : "You've taken the first step. Your body is already starting to heal.";

  // Next milestone teaser
  const nextTeaser = next
    ? `Next milestone: ${next.label} — ${next.description}`
    : null;

  const icon: React.ComponentProps<typeof Ionicons>['name'] = allComplete
    ? 'trophy'
    : lastReached
    ? 'checkmark-circle'
    : 'flag';

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
            <View style={{
              width: 120, height: 120, borderRadius: 60,
              backgroundColor: allComplete
                ? 'rgba(34,197,94,0.15)'
                : colors.isDark ? 'rgba(160,150,220,0.12)' : 'rgba(140,122,102,0.1)',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Ionicons
                name={icon}
                size={56}
                color={allComplete ? '#22c55e' : colors.isDark ? '#c4b5fd' : '#8c7a66'}
              />
            </View>

            <Text
              style={{
                fontSize: 40,
                fontWeight: '800',
                color: colors.textPrimary,
                textAlign: 'center',
                marginTop: 24,
                textTransform: 'capitalize',
              }}
            >
              {title}
            </Text>

            <Text
              style={{
                fontSize: 18,
                color: colors.textSecondary,
                textAlign: 'center',
                lineHeight: 26,
                marginTop: 12,
                paddingHorizontal: 8,
              }}
            >
              {description}
            </Text>

            <Text
              style={{
                fontSize: 48,
                fontWeight: '800',
                color: colors.textPrimary,
                marginTop: 24,
              }}
            >
              {daysFree} {daysFree === 1 ? 'day' : 'days'}
            </Text>
            <Text style={{ fontSize: 15, color: colors.textMuted, marginTop: 4 }}>
              nicotine-free
            </Text>

            {nextTeaser && (
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textMuted,
                  textAlign: 'center',
                  marginTop: 24,
                  lineHeight: 20,
                }}
              >
                {nextTeaser}
              </Text>
            )}
          </View>

          {/* Continue button */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
            <Pressable
              onPress={onClose}
              style={{
                backgroundColor: colors.isDark ? 'rgba(255,255,255,0.95)' : '#ffffff',
                borderRadius: 16,
                padding: 17,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#1a1a2e', fontWeight: '700', fontSize: 16 }}>
                Keep going
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </AnimatedSkyBackground>
    </Modal>
  );
}
