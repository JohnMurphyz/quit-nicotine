import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { BreathingExercise } from '@/src/components/BreathingExercise';
import { getDailyAffirmation } from '@/src/constants/affirmations';
import { getBenefitsForMotivations } from '@/src/constants/benefits';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useAuthStore } from '@/src/stores/authStore';
import { useCravingStore } from '@/src/stores/cravingStore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { differenceInDays } from 'date-fns';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TIPS = [
  { icon: 'water-outline', text: 'Slowly drink a glass of freezing cold water' },
  { icon: 'walk-outline', text: 'Stand up and change your environment' },
  { icon: 'call-outline', text: 'Message someone you trust right now' },
  { icon: 'fitness-outline', text: 'Do 10 deep squats or pushups' },
  { icon: 'hand-left-outline', text: 'Squeeze a stress ball or pillow tightly' },
  { icon: 'musical-notes-outline', text: 'Put on a song you know all the words to' },
];

export default function CravingSOSScreen() {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const { user, profile } = useAuthStore();
  const { cravings, logCraving, markResisted } = useCravingStore();

  const [seconds, setSeconds] = useState(0);
  const [sosCravingId, setSosCravingId] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Pick ONE random grounding tip to show on this session to avoid list paralysis
  const activeTip = useMemo(() => TIPS[Math.floor(Math.random() * TIPS.length)], []);

  // Fetch the user's primary reason for quitting
  const primaryGoal = useMemo(() => {
    if (!profile?.motivations?.length) return null;
    const allBenefits = getBenefitsForMotivations(profile.motivations);
    return allBenefits.length > 0 ? allBenefits[0] : null;
  }, [profile?.motivations]);

  const daysSinceQuit = useMemo(() => {
    if (!profile?.quit_date) return 0;
    return differenceInDays(new Date(), new Date(profile.quit_date));
  }, [profile?.quit_date]);

  const affirmation = useMemo(() => getDailyAffirmation(daysSinceQuit), [daysSinceQuit]);

  useEffect(() => {
    // Log an SOS craving immediately on open
    const log = async () => {
      if (!user?.id) return;
      await logCraving(user.id, { intensity: 8 });
    };
    log();

    // Start timer
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Capture the assigned craving ID after logging so we can mark it 'resisted' when done
  useEffect(() => {
    if (!sosCravingId && cravings.length > 0) {
      setSosCravingId(cravings[0].id);
    }
  }, [cravings, sosCravingId]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMadeIt = async () => {
    if (sosCravingId) {
      await markResisted(sosCravingId);
    }

    Alert.alert(
      "You Did It! 🎉",
      "Writing down how you got through this craving can help you build strength for the next one. Would you like to log a quick journal entry?",
      [
        {
          text: "No, thanks",
          style: "cancel",
          onPress: () => navigation.goBack()
        },
        {
          text: "Yes, let's journal",
          onPress: () => {
            // Rebuild the navigation state so they land in the Journal tab, 
            // with the JournalEntry pushed on top of it.
            (navigation as any).reset({
              index: 1,
              routes: [
                {
                  name: 'Tabs',
                  state: { routes: [{ name: 'Journal' }] }
                },
                {
                  name: 'JournalEntry',
                  params: { initialTitle: 'SOS Note' }
                },
              ],
            });
          }
        }
      ]
    );
  };

  return (
    <AnimatedSkyBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 20, paddingTop: 16 }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: colors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              width: 40, height: 40, borderRadius: 20,
              alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </Pressable>
        </View>

        <ScrollView
          style={{ flex: 1, paddingHorizontal: 24 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >

          {/* Top Section: Reassurance */}
          <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 20 }}>
            <Text style={{ fontSize: 20, color: colors.textSecondary, marginBottom: 8, textAlign: 'center' }}>
              You are stronger than this craving.
            </Text>
            <Text style={{ fontSize: 56, fontWeight: '800', color: colors.textPrimary, letterSpacing: 2 }}>
              {formatTime(seconds)}
            </Text>
          </View>

          {/* Core Feature: Immersive Breathing Exercise */}
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <BreathingExercise />
          </View>

          {/* Bottom Action Area */}
          <View style={{ gap: 16, marginTop: 40 }}>

            {/* Primary Motivation (if exists) */}
            {primaryGoal && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                  gap: 12
                }}
              >
                <Text style={{ fontSize: 28 }}>{primaryGoal.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, textTransform: 'uppercase', fontWeight: '700', color: colors.textMuted, letterSpacing: 1 }}>
                    Remember Why You Quit
                  </Text>
                  <Text style={{ fontSize: 18, color: colors.textPrimary, fontWeight: '600' }}>
                    {primaryGoal.title}
                  </Text>
                </View>
              </View>
            )}

            {/* Single Grounding Tip */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.isDark ? 'rgba(124, 58, 237, 0.15)' : 'rgba(124, 58, 237, 0.08)',
                borderWidth: 1,
                borderColor: colors.isDark ? 'rgba(124, 58, 237, 0.3)' : 'rgba(124, 58, 237, 0.2)',
                borderRadius: 20,
                padding: 16,
                gap: 16
              }}
            >
              <View style={{ backgroundColor: colors.isDark ? 'rgba(124, 58, 237, 0.3)' : 'rgba(124, 58, 237, 0.15)', padding: 12, borderRadius: 16 }}>
                <Ionicons name={activeTip.icon as any} size={28} color={colors.isDark ? '#a78bfa' : '#7c3aed'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, textTransform: 'uppercase', fontWeight: '700', color: colors.isDark ? '#a78bfa' : '#7c3aed', letterSpacing: 1, marginBottom: 4 }}>
                  Grounding Action
                </Text>
                <Text style={{ fontSize: 16, color: colors.textPrimary, lineHeight: 22 }}>
                  {activeTip.text}
                </Text>
              </View>
            </View>

            {/* Success Button */}
            <TouchableOpacity
              onPress={handleMadeIt}
              activeOpacity={0.8}
              style={{
                backgroundColor: colors.textSecondary,
                borderRadius: 16,
                height: 64,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: colors.textSecondary,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '800', color: colors.textPrimary, letterSpacing: 0.5 }}>
                I made it through
              </Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 14, color: colors.textMuted, textAlign: 'center', fontStyle: 'italic', paddingHorizontal: 20 }}>
              "{affirmation}"
            </Text>

            {/* Distraction Button */}
            <TouchableOpacity
              onPress={() => (navigation as any).navigate('Articles')}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                height: 56,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: colors.isDark ? '#a78bfa' : '#7c3aed',
                backgroundColor: colors.isDark ? 'rgba(124,58,237,0.12)' : 'rgba(124,58,237,0.07)',
              }}
            >
              <Ionicons name="library-outline" size={20} color={colors.isDark ? '#a78bfa' : '#7c3aed'} />
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.isDark ? '#a78bfa' : '#7c3aed' }}>
                Need a distraction?
              </Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </SafeAreaView>
    </AnimatedSkyBackground>
  );
}
