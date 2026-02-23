import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { LibraryCard } from '@/src/components/LibraryCard';
import { MeditateModal } from '@/src/components/MeditateModal';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenTitle } from '@/src/components/ScreenTitle';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import type { AppStackParamList } from '@/src/navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  {
    slug: 'chemistry',
    emoji: '🧪',
    title: 'The Chemistry of Dependence',
    description: 'How nicotine hijacks your brain\'s own signaling molecules.',
    readTime: '6 min read',
  },
  {
    slug: 'habit-loops',
    emoji: '🔄',
    title: 'Breaking Habit Loops',
    description: 'Understand and rewire the automatic programs driving your use.',
    readTime: '6 min read',
  },
  {
    slug: 'healing',
    emoji: '💚',
    title: 'Physical Healing Milestones',
    description: 'How every organ system recovers after you quit.',
    readTime: '7 min read',
  },
  {
    slug: 'sleep-energy',
    emoji: '😴',
    title: 'Sleep & Energy Recovery',
    description: 'Why withdrawal disrupts sleep and when your energy returns.',
    readTime: '6 min read',
  },
  {
    slug: 'freedom',
    emoji: '🕊️',
    title: 'The Freedom Mindset',
    description: 'Shift from feeling deprived to feeling liberated.',
    readTime: '6 min read',
  },
  {
    slug: 'staying-quit',
    emoji: '🛡️',
    title: 'Staying Quit Long-Term',
    description: 'Defend against complacency and the "just one" trap.',
    readTime: '7 min read',
  },
];

interface Video {
  id: string;
  title: string;
}

const VIDEOS: Video[] = [
  {
    id: 'QpnGsasp9j8',
    title: 'Why You Should Quit Nicotine',
  },
  {
    id: 'i4gvIeA3RcI',
    title: 'Understanding & Treating Addiction — Dr. Anna Lembke',
  },
  {
    id: 'aEfkx3DsXjs',
    title: 'Find Balance in the Age of Indulgence — Dr. Anna Lembke',
  },
  {
    id: 'jCWADjUA9iI',
    title: 'Dopamine Fasting 2.0 — Overcome Addiction & Restore Motivation',
  },
  {
    id: 'yLGZeoC9WMs',
    title: 'Break the Cycle of Addiction — Ram Dass',
  },
  {
    id: 'AT9mnHrQoL0',
    title: 'Vaping or Nicotine Pouch? — Bryan Johnson',
  },
  {
    id: 'cHEOsKddURQ',
    title: 'Vaping Is Too Good To Be True — Kurzgesagt',
  },
  {
    id: '0TL2Vh7goJc',
    title: 'Quit Smoking — Allen Carr',
  },
];

function getThumbnail(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export default function ContentScreen() {
  const navigation = useNavigation<Nav>();
  const colors = useThemeColors();
  const [showMeditate, setShowMeditate] = useState(false);


  return (
    <AnimatedSkyBackground>
      <View className="flex-1">
        {/* Hero Image - fixed at top */}
        <View style={{ height: 220, marginTop: -10 }}>
          <Image
            source={require('@/assets/images/scene-desert-hero.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', '#0d0b2e']}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60 }}
          />
          <SafeAreaView className="absolute top-0 left-0 right-0" edges={['top']}>
            <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
              <ScreenTitle>Library</ScreenTitle>
            </View>
          </SafeAreaView>
        </View>

        <ScrollView
          className="flex-1 px-5 pt-4 pb-12"
          showsVerticalScrollIndicator={false}
        >

          {/* Category Buttons 2x2 Grid */}
          <View className="flex-col gap-3 mb-8">
            <View className="flex-row gap-3">
              <LibraryCard
                type="articles"
                title="Articles"
                index={0}
                onPress={() => navigation.navigate('Articles')}
              />
              <LibraryCard
                type="relaxation"
                title="Relaxation"
                index={1}
                onPress={() => navigation.navigate('Relaxation')}
              />
            </View>
            <View className="flex-row gap-3">
              <LibraryCard
                type="breathe"
                title="Breathe"
                index={2}
                onPress={() => setShowMeditate(true)}
              />
              <LibraryCard
                type="motivation"
                title="Motivation"
                index={3}
                onPress={() => navigation.navigate('Motivation')}
              />
            </View>
          </View>

          {/* Videos Section */}
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 14 }}>
            Videos
          </Text>
          <View style={{ gap: 14, marginBottom: 40 }}>
            {VIDEOS.map((video, index) => (
              <Animated.View
                key={video.id}
                entering={FadeInDown.delay(100 + (index + 4) * 100).duration(600).easing(Easing.out(Easing.cubic))}
              >
                <Pressable
                  onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${video.id}`)}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.85 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  })}
                >
                  <Image
                    source={{ uri: getThumbnail(video.id) }}
                    style={{
                      width: '100%',
                      aspectRatio: 16 / 9,
                      borderRadius: 14,
                      backgroundColor: colors.elevatedBg,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: colors.textPrimary,
                      marginTop: 8,
                      textAlign: 'center',
                    }}
                    numberOfLines={2}
                  >
                    {video.title}
                  </Text>
                </Pressable>
              </Animated.View>
            ))}
          </View>

        </ScrollView>

        {/* Modals */}
        <MeditateModal
          visible={showMeditate}
          onClose={() => setShowMeditate(false)}
        />
      </View>
    </AnimatedSkyBackground>
  );
}
