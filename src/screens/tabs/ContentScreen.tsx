import { useState, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '@/src/navigation/types';
import { MeditateModal } from '@/src/components/MeditateModal';
import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { useThemeColors } from '@/src/hooks/useThemeColors';

type Nav = NativeStackNavigationProp<AppStackParamList>;

export const CONTENT_ITEMS = [
  {
    slug: 'why-quit',
    emoji: '🎯',
    title: 'Why Quit Nicotine?',
    description: 'Understanding what nicotine really does to your brain and body.',
    readTime: '7 min read',
  },
  {
    slug: 'law-of-addiction',
    emoji: '⚖️',
    title: 'The Law of Addiction',
    description: 'Why "just one" is never just one — the science behind the 95% rule.',
    readTime: '5 min read',
  },
  {
    slug: 'cravings',
    emoji: '🧠',
    title: 'Managing Cravings',
    description: 'Practical techniques for when urges hit hardest.',
    readTime: '8 min read',
  },
  {
    slug: 'timeline',
    emoji: '⏱️',
    title: 'Recovery Timeline',
    description: 'What happens to your body hour by hour, day by day.',
    readTime: '7 min read',
  },
  {
    slug: 'triggers',
    emoji: '⚡',
    title: 'Identifying Triggers',
    description: 'Recognize the situations that make you reach for nicotine.',
    readTime: '6 min read',
  },
  {
    slug: 'support',
    emoji: '🤝',
    title: 'Building Support',
    description: 'How the right people around you make quitting easier.',
    readTime: '7 min read',
  },
];

const QUICK_ACTIONS = [
  { label: 'Breathe', icon: 'leaf' as const, action: 'breathing' },
  { label: 'Meditate', icon: 'flower' as const, action: 'meditate' },
  { label: 'Journal', icon: 'book' as const, action: 'journal' },
  { label: 'SOS', icon: 'alert-circle' as const, action: 'sos' },
];

export default function ContentScreen() {
  const navigation = useNavigation<Nav>();
  const colors = useThemeColors();
  const [showMeditate, setShowMeditate] = useState(false);
  const relaxationRef = useRef<View>(null);
  const scrollRef = useRef<ScrollView>(null);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'breathing':
      case 'meditate':
        setShowMeditate(true);
        break;
      case 'journal':
        navigation.getParent()?.navigate('Tabs', { screen: 'Journal' });
        break;
      case 'sos':
        navigation.navigate('CravingSOS');
        break;
    }
  };

  const scrollToRelaxation = () => {
    relaxationRef.current?.measureLayout(
      scrollRef.current as any,
      (_x, y) => {
        scrollRef.current?.scrollTo({ y, animated: true });
      },
      () => {},
    );
  };

  return (
    <AnimatedSkyBackground>
    <SafeAreaView className="flex-1">
      <ScrollView
        ref={scrollRef}
        className="flex-1 px-5 pt-6 pb-12"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={{ fontSize: 30, fontWeight: '700', color: colors.textPrimary, marginBottom: 24 }}>Library</Text>

        {/* Quick Action Icons */}
        <View className="flex-row justify-between mb-8">
          {QUICK_ACTIONS.map((item) => (
            <Pressable
              key={item.action}
              className="items-center"
              onPress={() => handleQuickAction(item.action)}
            >
              <View
                className="w-16 h-16 rounded-full items-center justify-center mb-2"
                style={{ backgroundColor: colors.elevatedBg }}
              >
                <Ionicons name={item.icon} size={28} color={colors.textAccent} />
              </View>
              <Text style={{ fontSize: 12, color: colors.textMuted }}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Category Buttons */}
        <View className="flex-row gap-3 mb-8">
          <Pressable
            className="flex-1 rounded-2xl p-5 items-center justify-center"
            style={{
              backgroundColor: '#f97316',
              minHeight: 80,
            }}
            onPress={() => navigation.navigate('Articles')}
          >
            <Ionicons name="document-text" size={28} color="white" />
            <Text className="text-white font-semibold text-base mt-1">
              Articles
            </Text>
          </Pressable>
          <Pressable
            className="flex-1 rounded-2xl p-5 items-center justify-center"
            style={{
              backgroundColor: '#3b82f6',
              minHeight: 80,
            }}
            onPress={scrollToRelaxation}
          >
            <Ionicons name="musical-notes" size={28} color="white" />
            <Text className="text-white font-semibold text-base mt-1">
              Relaxation
            </Text>
          </Pressable>
        </View>

        {/* Relaxation Noises Section */}
        <View ref={relaxationRef} className="mb-10">
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 }}>
            Relaxation Noises
          </Text>
          <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 16 }}>
            Calm your mind with soothing sounds
          </Text>

          <Pressable
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: colors.cardBg }}
            onPress={() => Alert.alert('Coming Soon', 'Relaxation sounds are coming in a future update.')}
          >
            <View
              className="h-40 items-center justify-center"
              style={{ backgroundColor: colors.elevatedBg }}
            >
              <Ionicons name="cloud-outline" size={48} color={colors.textAccent} />
            </View>
            <View className="p-4">
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary }}>
                Morning Reset
              </Text>
              <Text style={{ fontSize: 14, color: colors.textMuted, marginTop: 4 }}>
                Start your day with calming ambient sounds
              </Text>
            </View>
          </Pressable>

          <Pressable
            className="rounded-2xl overflow-hidden mt-3"
            style={{ backgroundColor: colors.cardBg }}
            onPress={() => Alert.alert('Coming Soon', 'Relaxation sounds are coming in a future update.')}
          >
            <View
              className="h-40 items-center justify-center"
              style={{ backgroundColor: colors.elevatedBg }}
            >
              <Ionicons name="moon-outline" size={48} color={colors.textAccent} />
            </View>
            <View className="p-4">
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary }}>
                Deep Calm
              </Text>
              <Text style={{ fontSize: 14, color: colors.textMuted, marginTop: 4 }}>
                Wind down with deep, peaceful tones
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>

      {/* Modals */}
      <MeditateModal
        visible={showMeditate}
        onClose={() => setShowMeditate(false)}
      />
    </SafeAreaView>
    </AnimatedSkyBackground>
  );
}
