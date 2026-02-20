import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { useThemeColors } from '@/src/hooks/useThemeColors';

interface PledgeModalProps {
  visible: boolean;
  onClose: () => void;
  onPledge: () => void;
  pledging: boolean;
  alreadyPledged: boolean;
  daysSinceQuit: number;
}

const TIPS: { icon: string; title: string; body: string }[] = [
  {
    icon: 'checkmark-circle-outline',
    title: 'Achievable Goal',
    body: 'When pledging, you agree to stay nicotine-free for the day only.',
  },
  {
    icon: 'sparkles-outline',
    title: 'Take it Easy',
    body: "Just live the day as normal and after pledging, don't change your mind.",
  },
  {
    icon: 'trophy-outline',
    title: 'Success is Inevitable',
    body: "Stay strong, the first few days/weeks will be tough but after that it'll get easier.",
  },
];

export function PledgeModal({
  visible,
  onClose,
  onPledge,
  pledging,
  alreadyPledged,
}: PledgeModalProps) {
  const colors = useThemeColors();

  const cardBorder = colors.isDark ? 'rgba(160,150,220,0.2)' : 'rgba(140,122,102,0.2)';
  const cardBg = colors.isDark ? 'rgba(160,150,220,0.06)' : 'rgba(140,122,102,0.06)';

  const handlePledge = () => {
    onPledge();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <AnimatedSkyBackground>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 }}>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={26} color={colors.textPrimary} />
            </Pressable>
            <Text style={{ fontSize: 17, fontWeight: '700', color: colors.textPrimary }}>Pledge</Text>
            <View style={{ width: 26 }} />
          </View>

          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Hand icon */}
            <View style={{ alignItems: 'center', marginTop: 48, marginBottom: 20 }}>
              <Ionicons
                name="hand-left-outline"
                size={100}
                color={colors.textMuted}
              />
            </View>

            {/* Title */}
            <Text style={{ fontSize: 24, fontWeight: '800', color: colors.textPrimary, textAlign: 'center', marginBottom: 12 }}>
              {alreadyPledged ? "You've Pledged Today" : 'Pledge Sobriety Today'}
            </Text>

            {/* Description */}
            <Text style={{ fontSize: 15, color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: 28, paddingHorizontal: 8 }}>
              Make a commitment to yourself not to use nicotine for today. You'll receive a notification in 24 hours to check in and see how you did.
            </Text>

            {/* Tips card */}
            <View
              style={{
                borderWidth: 1,
                borderColor: cardBorder,
                borderRadius: 16,
                backgroundColor: cardBg,
                padding: 20,
                gap: 24,
                marginBottom: 32,
              }}
            >
              {TIPS.map((tip) => (
                <View key={tip.title} style={{ flexDirection: 'row', gap: 14 }}>
                  <Ionicons name={tip.icon as any} size={24} color={colors.textMuted} style={{ marginTop: 2 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 }}>
                      {tip.title}
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.textMuted, lineHeight: 20 }}>
                      {tip.body}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={{ flex: 1 }} />

            {/* Action button */}
            {alreadyPledged ? (
              <Pressable
                onPress={onClose}
                style={{
                  backgroundColor: colors.elevatedBg,
                  borderRadius: 16,
                  padding: 17,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colors.textSecondary, fontWeight: '700', fontSize: 16 }}>Done</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={handlePledge}
                disabled={pledging}
                style={{
                  backgroundColor: '#faf7f4',
                  borderRadius: 16,
                  padding: 17,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#362d23', fontWeight: '700', fontSize: 16 }}>
                  {pledging ? 'Pledging...' : 'Pledge Now'}
                </Text>
              </Pressable>
            )}
          </ScrollView>
        </SafeAreaView>
      </AnimatedSkyBackground>
    </Modal>
  );
}
