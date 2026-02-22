import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { ScreenTitle } from '@/src/components/ScreenTitle';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FACTS = [
  {
    icon: 'flash-outline' as const,
    title: 'The Law of Addiction',
    body: "One hit of nicotine re-activates the brain's hijacked dopamine pathways and immediately restarts the cycle of withdrawal and cravings. There is no such thing as \"just one\".",
  },
  {
    icon: 'stats-chart-outline' as const,
    title: 'The 95% Rule',
    body: 'Research shows that using any nicotine at all during the post-cessation period gives a 95% probability of resuming your regular pattern of use.',
  },
  {
    icon: 'warning-outline' as const,
    title: 'The Hidden Danger',
    body: "Surviving a one-day relapse and stopping again is psychologically hazardous. It teaches the wrong lesson — that you can cheat the addiction — leading to a cycle of perpetual relapses.",
  },
];

const PAGES = [{ key: 'honesty' }, { key: 'facts' }, { key: 'journal' }];

export default function RelapseWizardScreen() {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const [page, setPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const borderColor = colors.isDark ? 'rgba(160,150,220,0.18)' : colors.borderColor;

  const goToPage = (next: number) => {
    setPage(next);
    flatListRef.current?.scrollToIndex({ index: next, animated: true });
  };

  const handleJournalYes = () => {
    (navigation as any).replace('JournalEntry', {
      initialTitle: 'Relapse reflection',
      initialContent: '',
    });
  };

  const renderPage = ({ index }: { item: { key: string }; index: number }) => {
    if (index === 0) {
      return (
        <View style={{ width: SCREEN_WIDTH, paddingHorizontal: 24 }}>
          <View style={{
            width: 80, height: 80, borderRadius: 40,
            backgroundColor: colors.isDark ? 'rgba(160,150,220,0.12)' : 'rgba(140,122,102,0.1)',
            alignItems: 'center', justifyContent: 'center',
            marginBottom: 28, alignSelf: 'center',
          }}>
            <Ionicons name="heart" size={38} color={colors.textSecondary} />
          </View>

          <ScreenTitle style={{ textAlign: 'center', lineHeight: 36, marginBottom: 20 }}>
            Relapses happen.
          </ScreenTitle>

          <Text style={{
            fontSize: 17, color: colors.textMuted,
            textAlign: 'center', lineHeight: 28, marginBottom: 16,
          }}>
            Being honest with yourself took courage. That matters.
          </Text>

          <Text style={{
            fontSize: 17, color: colors.textMuted,
            textAlign: 'center', lineHeight: 28, marginBottom: 16,
          }}>
            Every person who has ever quit has stumbled. It doesn't erase your progress or your strength — it's part of the journey.
          </Text>

          <Text style={{
            fontSize: 17, color: colors.textMuted,
            textAlign: 'center', lineHeight: 28,
          }}>
            What matters most right now is that you're still here, still trying. Be kind to yourself.
          </Text>
        </View>
      );
    }

    if (index === 1) {
      return (
        <ScrollView
          style={{ width: SCREEN_WIDTH }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <ScreenTitle style={{ fontSize: 22, marginBottom: 20 }}>
            What you need to know
          </ScreenTitle>

          {FACTS.map((fact) => (
            <View
              key={fact.title}
              style={{
                backgroundColor: colors.isDark ? 'rgba(160,150,220,0.06)' : 'rgba(140,122,102,0.05)',
                borderWidth: 1, borderColor,
                borderRadius: 14, padding: 16, marginBottom: 12,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Ionicons name={fact.icon} size={20} color={colors.textSecondary} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textSecondary, flex: 1 }}>
                  {fact.title}
                </Text>
              </View>
              <Text style={{ fontSize: 14, color: colors.textMuted, lineHeight: 22 }}>
                {fact.body}
              </Text>
            </View>
          ))}

          {/* Reset confirmation banner */}
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 12,
            backgroundColor: colors.isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.07)',
            borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)',
            borderRadius: 14, padding: 16, marginTop: 4,
          }}>
            <Ionicons name="refresh-circle-outline" size={24} color="#ef4444" />
            <Text style={{ fontSize: 13, color: colors.textMuted, lineHeight: 19, flex: 1 }}>
              Your timer, streak and pledge have been reset. Day one starts now.
            </Text>
          </View>
        </ScrollView>
      );
    }

    // Page 3 — journal prompt (rendered via bottom buttons, just show content here)
    return (
      <View style={{ width: SCREEN_WIDTH, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <View style={{
          width: 80, height: 80, borderRadius: 40,
          backgroundColor: colors.isDark ? 'rgba(160,150,220,0.12)' : 'rgba(140,122,102,0.1)',
          alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
        }}>
          <Ionicons name="journal-outline" size={36} color={colors.textSecondary} />
        </View>

        <ScreenTitle style={{ fontSize: 26, textAlign: 'center', lineHeight: 34, marginBottom: 12 }}>
          You've got this.
        </ScreenTitle>

        <Text style={{
          fontSize: 16, color: colors.textMuted,
          textAlign: 'center', lineHeight: 26,
        }}>
          Journalling what happened can help you understand your triggers and build a stronger quit. Would you like to write about it?
        </Text>
      </View>
    );
  };

  return (
    <AnimatedSkyBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
          paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8,
        }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Progress dots */}
        <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', marginBottom: 24 }}>
          {PAGES.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === page ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === page
                  ? colors.textSecondary
                  : (colors.isDark ? 'rgba(160,150,220,0.25)' : 'rgba(140,122,102,0.2)'),
              }}
            />
          ))}
        </View>

        {/* Pages */}
        <FlatList
          ref={flatListRef}
          data={PAGES}
          renderItem={renderPage}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          style={{ flex: 1 }}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
        />

        {/* Bottom buttons */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 16, gap: 12 }}>
          {page < 2 ? (
            <TouchableOpacity
              onPress={() => goToPage(page + 1)}
              activeOpacity={0.85}
              style={{
                borderRadius: 14, paddingVertical: 17, alignItems: 'center',
                backgroundColor: colors.textSecondary,
                borderWidth: 2, borderColor: colors.textSecondary,
              }}
            >
              <Text style={{ color: colors.textPrimary, fontSize: 17, fontWeight: '700' }}>
                {page === 0 ? 'Next' : 'I understand'}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                onPress={handleJournalYes}
                activeOpacity={0.85}
                style={{
                  borderRadius: 14, paddingVertical: 17, alignItems: 'center',
                  backgroundColor: colors.textSecondary,
                  borderWidth: 2, borderColor: colors.textSecondary,
                }}
              >
                <Text style={{ color: colors.textPrimary, fontSize: 17, fontWeight: '700' }}>
                  Yes, let's reflect
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
                style={{
                  borderRadius: 14, paddingVertical: 17, alignItems: 'center',
                  backgroundColor: 'transparent',
                  borderWidth: 2, borderColor: colors.textMuted,
                }}
              >
                <Text style={{ color: colors.textMuted, fontSize: 17, fontWeight: '700' }}>
                  No, I'm good
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </SafeAreaView>
    </AnimatedSkyBackground>
  );
}
