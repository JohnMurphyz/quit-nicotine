import { ActionButtonRow } from '@/src/components/ActionButtonRow';
import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { BenefitSelectorModal } from '@/src/components/BenefitSelectorModal';
import { BreathingOrb } from '@/src/components/BreathingOrb';
import { CravingLogger } from '@/src/components/CravingLogger';
import { DayStreakRow } from '@/src/components/DayStreakRow';
import { FlameIcon } from '@/src/components/FlameIcon';
import { HomeMainCard } from '@/src/components/HomeMainCard';
import { HomeTodoCard } from '@/src/components/HomeTodoCard';
import { MeditateModal } from '@/src/components/MeditateModal';
import { PledgeModal } from '@/src/components/PledgeModal';
import { RelapseModal } from '@/src/components/RelapseModal';
import { ScreenTitle } from '@/src/components/ScreenTitle';
import { StreakCelebrationModal } from '@/src/components/StreakCelebrationModal';
import { SymptomSelectorModal } from '@/src/components/SymptomSelectorModal';
import { useCheckInInterval } from '@/src/hooks/useCheckInInterval';
import { useCravings } from '@/src/hooks/useCravings';
import { useJournal } from '@/src/hooks/useJournal';
import { useNotifications } from '@/src/hooks/useNotifications';
import { useStreak } from '@/src/hooks/useStreak';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import type { AppStackParamList, TabParamList } from '@/src/navigation/types';
import { useAuthStore } from '@/src/stores/authStore';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { Easing, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<AppStackParamList>
>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { profile } = useAuthStore();
  const { streak, confirming, confirmToday, confirmations } = useStreak();
  const { logCraving, logging } = useCravings();
  const { isCheckInDue, recordCheckIn, resetCheckIn } = useCheckInInterval();
  const colors = useThemeColors();
  const { enabled: notificationsEnabled, requestPermission } = useNotifications();
  const { entries } = useJournal();
  const [now, setNow] = useState(new Date());

  const [cravingModalVisible, setCravingModalVisible] = useState(false);
  const [pledgeModalVisible, setPledgeModalVisible] = useState(false);
  const [meditateModalVisible, setMeditateModalVisible] = useState(false);
  const [benefitSelectorVisible, setBenefitSelectorVisible] = useState(false);
  const [symptomSelectorVisible, setSymptomSelectorVisible] = useState(false);
  const [streakCelebrationVisible, setStreakCelebrationVisible] = useState(false);
  const [celebrationStreak, setCelebrationStreak] = useState(0);
  const [relapseModalVisible, setRelapseModalVisible] = useState(false);

  const motivations = profile?.motivations ?? [];
  const trackedSymptoms = profile?.tracked_symptoms ?? [];

  const alreadyPledged = !isCheckInDue;

  // Update "now" every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const quitDuration = useMemo(() => {
    if (!profile?.quit_date) return null;
    const quitDate = new Date(profile.quit_date);
    const days = differenceInDays(now, quitDate);
    const hours = differenceInHours(now, quitDate) % 24;
    const minutes = differenceInMinutes(now, quitDate) % 60;
    return { days: Math.max(0, days), hours: Math.max(0, hours), minutes: Math.max(0, minutes) };
  }, [profile?.quit_date, now]);

  const handlePledge = useCallback(async () => {
    const newStreak = (streak?.current_streak ?? 0) + 1;
    await recordCheckIn();
    await confirmToday();
    if (newStreak >= 3) {
      setCelebrationStreak(newStreak);
      setStreakCelebrationVisible(true);
    }
  }, [recordCheckIn, confirmToday, streak?.current_streak]);

  const handleRelapse = useCallback(() => {
    Alert.alert(
      'Did you relapse?',
      'This will reset your progress back to zero.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, I relapsed',
          style: 'destructive',
          onPress: () => setRelapseModalVisible(true),
        },
      ],
    );
  }, []);

  const actionButtons = [
    {
      icon: 'hand-left-outline',
      label: 'Pledge',
      onPress: () => setPledgeModalVisible(true),
      completed: alreadyPledged,
    },
    {
      icon: 'leaf-outline',
      label: 'Meditate',
      onPress: () => setMeditateModalVisible(true),
    },
    {
      icon: 'alert-circle-outline',
      label: 'Relapsed',
      onPress: handleRelapse,
    },
  ];

  return (
    <AnimatedSkyBackground>
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header — app title + streak flame badge */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
          <ScreenTitle>FREED</ScreenTitle>
          <Pressable
            onPress={() => {
              setCelebrationStreak(streak?.current_streak ?? 0);
              setStreakCelebrationVisible(true);
            }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
          >
            <FlameIcon size={26} active={(streak?.current_streak ?? 0) > 0} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '800',
                color: (streak?.current_streak ?? 0) > 0 ? colors.streakTextActive : colors.streakText,
              }}
            >
              {streak?.current_streak ?? 0}
            </Text>
          </Pressable>
        </View>

        {/* Day Streak Row */}
        <Animated.View entering={FadeInDown.delay(100).duration(600).easing(Easing.out(Easing.cubic))}>
          <DayStreakRow confirmations={confirmations} />
        </Animated.View>

        {/* Main content */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Breathing Orb */}
          <Animated.View entering={FadeInDown.delay(200).duration(600).easing(Easing.out(Easing.cubic))} style={{ alignItems: 'center', paddingTop: 16 }}>
            <BreathingOrb size={160} />
          </Animated.View>

          {/* Timer display */}
          <Animated.View entering={FadeInDown.delay(300).duration(600).easing(Easing.out(Easing.cubic))} style={{ alignItems: 'center', paddingVertical: 16 }}>
            <Text style={{ fontSize: 13, color: colors.textMuted, fontWeight: '600', marginBottom: 4, letterSpacing: 0.5 }}>
              You've been nicotine-free for
            </Text>
            <Text style={{ fontSize: 44, fontWeight: '700', color: colors.textPrimary, lineHeight: 54 }}>
              {quitDuration?.days ?? 0} days
            </Text>
            <View style={{ backgroundColor: colors.pillBg, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6, marginTop: 8 }}>
              <Text style={{ color: colors.pillText, fontWeight: '600', fontSize: 14 }}>
                {quitDuration?.hours ?? 0}hr {quitDuration?.minutes ?? 0}m
              </Text>
            </View>
          </Animated.View>

          {/* Action buttons */}
          <Animated.View entering={FadeInDown.delay(400).duration(600).easing(Easing.out(Easing.cubic))}>
            <ActionButtonRow buttons={actionButtons} />
          </Animated.View>

          {/* Panic Button */}
          <Animated.View entering={FadeInDown.delay(500).duration(600).easing(Easing.out(Easing.cubic))}>
            <Pressable
              onPress={() => navigation.navigate('CravingSOS')}
              style={{ marginHorizontal: 16, marginTop: 8, backgroundColor: '#ef4444', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Ionicons name="alert-circle" size={22} color="white" />
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 17 }}>Panic Button</Text>
            </Pressable>
          </Animated.View>

          {/* To-do checklist */}
          {profile && (
            <Animated.View entering={FadeInDown.delay(600).duration(600).easing(Easing.out(Easing.cubic))}>
              <HomeTodoCard
                profile={profile}
                notificationsEnabled={notificationsEnabled}
                hasJournalEntries={entries.length > 0}
                onSetGoals={() => setBenefitSelectorVisible(true)}
                onTrackSymptoms={() => setSymptomSelectorVisible(true)}
                onEnableNotifications={requestPermission}
                onAddPartner={() => navigation.navigate('Accountability')}
                onDestroyProducts={() => navigation.navigate('DestroyProducts')}
                onWriteJournal={() => navigation.navigate('JournalEntry', {})}
              />
            </Animated.View>
          )}

          {/* Main navigation */}
          <Animated.View layout={LinearTransition.duration(300)} entering={FadeInDown.delay(700).duration(600).easing(Easing.out(Easing.cubic))}>
            <HomeMainCard
              onNavigate={(screen) => {
                const tabScreens = ['Learn', 'Timeline'];
                if (tabScreens.includes(screen)) {
                  navigation.navigate('Tabs', { screen } as any);
                } else {
                  (navigation.navigate as any)(screen);
                }
              }}
            />
          </Animated.View>
        </ScrollView>

        {/* Modals */}
        <PledgeModal
          visible={pledgeModalVisible}
          onClose={() => setPledgeModalVisible(false)}
          onPledge={handlePledge}
          pledging={confirming}
          alreadyPledged={alreadyPledged}
          daysSinceQuit={quitDuration?.days ?? 0}
        />

        <MeditateModal
          visible={meditateModalVisible}
          onClose={() => setMeditateModalVisible(false)}
        />

        <CravingLogger
          visible={cravingModalVisible}
          onClose={() => setCravingModalVisible(false)}
          onLog={logCraving}
          onOpenSOS={() => { setCravingModalVisible(false); navigation.navigate('CravingSOS'); }}
          logging={logging}
        />

        <BenefitSelectorModal
          visible={benefitSelectorVisible}
          onClose={() => setBenefitSelectorVisible(false)}
          initialSelections={motivations}
        />

        <SymptomSelectorModal
          visible={symptomSelectorVisible}
          onClose={() => setSymptomSelectorVisible(false)}
          initialSelections={trackedSymptoms}
        />

        <StreakCelebrationModal
          visible={streakCelebrationVisible}
          onClose={() => setStreakCelebrationVisible(false)}
          streakCount={celebrationStreak}
        />
        <RelapseModal
          visible={relapseModalVisible}
          onClose={() => setRelapseModalVisible(false)}
          onReset={resetCheckIn}
        />
      </SafeAreaView>
    </AnimatedSkyBackground>
  );
}
