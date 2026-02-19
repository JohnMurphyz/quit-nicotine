import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useStreak } from '@/src/hooks/useStreak';
import { useAuthStore } from '@/src/stores/authStore';
import { useCravings } from '@/src/hooks/useCravings';
import { useCheckInInterval } from '@/src/hooks/useCheckInInterval';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { DayStreakRow } from '@/src/components/DayStreakRow';
import { CravingLogger } from '@/src/components/CravingLogger';
import { ActionButtonRow } from '@/src/components/ActionButtonRow';
import { PledgeModal } from '@/src/components/PledgeModal';
import { MeditateModal } from '@/src/components/MeditateModal';
import { MoreSheet } from '@/src/components/MoreSheet';
import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { BreathingOrb } from '@/src/components/BreathingOrb';
import { FlameIcon } from '@/src/components/FlameIcon';
import { BenefitSelectorModal } from '@/src/components/BenefitSelectorModal';
import { SymptomSelectorModal } from '@/src/components/SymptomSelectorModal';
import { StreakCelebrationModal } from '@/src/components/StreakCelebrationModal';
import { HomeTodoCard } from '@/src/components/HomeTodoCard';
import { HomeMainCard } from '@/src/components/HomeMainCard';
import { useNotifications } from '@/src/hooks/useNotifications';
import { useJournal } from '@/src/hooks/useJournal';
import type { AppStackParamList, TabParamList } from '@/src/navigation/types';

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
  const [moreSheetVisible, setMoreSheetVisible] = useState(false);
  const [benefitSelectorVisible, setBenefitSelectorVisible] = useState(false);
  const [symptomSelectorVisible, setSymptomSelectorVisible] = useState(false);
  const [streakCelebrationVisible, setStreakCelebrationVisible] = useState(false);
  const [celebrationStreak, setCelebrationStreak] = useState(0);

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
    confirmToday();
    if (newStreak >= 3) {
      setCelebrationStreak(newStreak);
      setStreakCelebrationVisible(true);
    }
  }, [recordCheckIn, confirmToday, streak?.current_streak]);

  const handleReset = useCallback(() => {
    Alert.alert(
      'Reset Timer',
      'This will reset your check-in. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetCheckIn(),
        },
      ],
    );
  }, [resetCheckIn]);

  const actionButtons = [
    {
      icon: 'hand-left-outline',
      label: 'Pledge',
      onPress: () => setPledgeModalVisible(true),
      completed: alreadyPledged,
    },
    {
      icon: 'body',
      label: 'Meditate',
      onPress: () => setMeditateModalVisible(true),
    },
    {
      icon: 'refresh',
      label: 'Reset',
      onPress: handleReset,
    },
    {
      icon: 'ellipsis-horizontal',
      label: 'More',
      onPress: () => setMoreSheetVisible(true),
    },
  ];

  return (
    <AnimatedSkyBackground>
    <SafeAreaView className="flex-1">
      {/* Header — app title + streak flame badge */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: colors.textPrimary }}>FREED</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
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
        </View>
      </View>

      {/* Day Streak Row */}
      <DayStreakRow confirmations={confirmations} />

      {/* Main content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Breathing Orb */}
        <View style={{ alignItems: 'center', paddingTop: 16 }}>
          <BreathingOrb size={160} />
        </View>

        {/* Timer display */}
        <View style={{ alignItems: 'center', paddingVertical: 16 }}>
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
        </View>

        {/* Action buttons */}
        <ActionButtonRow buttons={actionButtons} />

        {/* To-do checklist */}
        {profile && (
          <HomeTodoCard
            profile={profile}
            notificationsEnabled={notificationsEnabled}
            hasJournalEntries={entries.length > 0}
            onSetGoals={() => setBenefitSelectorVisible(true)}
            onTrackSymptoms={() => setSymptomSelectorVisible(true)}
            onEnableNotifications={requestPermission}
            onAddPartner={() => navigation.navigate('Accountability')}
            onDestroyProducts={() => navigation.navigate('Settings')}
            onWriteJournal={() => navigation.navigate('Journal')}
          />
        )}

        {/* Main navigation */}
        <HomeMainCard
          onNavigate={(screen) => {
            const tabScreens = ['Journal', 'Learn', 'Timeline'];
            if (tabScreens.includes(screen)) {
              navigation.navigate('Tabs', { screen } as any);
            } else {
              (navigation.navigate as any)(screen);
            }
          }}
        />
      </ScrollView>

      {/* Panic Button — pinned */}
      <Pressable
        onPress={() => navigation.navigate('CravingSOS')}
        style={{ margin: 16, backgroundColor: '#ef4444', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        <Ionicons name="alert-circle" size={22} color="white" />
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 17 }}>Panic Button</Text>
      </Pressable>

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

      <MoreSheet
        visible={moreSheetVisible}
        onClose={() => setMoreSheetVisible(false)}
        onLogCraving={() => setCravingModalVisible(true)}
        onOpenJournal={() => navigation.navigate('Journal')}
        onOpenProfile={() => navigation.navigate('Profile')}
        onOpenAccountability={() => navigation.navigate('Accountability')}
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
    </SafeAreaView>
    </AnimatedSkyBackground>
  );
}
