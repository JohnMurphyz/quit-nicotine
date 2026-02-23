import { AchievementOverlay } from '@/src/components/AchievementOverlay';
import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { BenefitSelectorModal } from '@/src/components/BenefitSelectorModal';
import { BenefitsList } from '@/src/components/BenefitsList';
import { JourneyBar, MILESTONES } from '@/src/components/JourneyBar';
import { MilestoneCelebrationModal } from '@/src/components/MilestoneCelebrationModal';
import { RecoveryRing } from '@/src/components/RecoveryRing';
import { ScreenTitle } from '@/src/components/ScreenTitle';
import { SymptomRecoveryList } from '@/src/components/SymptomRecoveryList';
import { SymptomSelectorModal } from '@/src/components/SymptomSelectorModal';
import { ACHIEVEMENTS } from '@/src/constants/achievements';
import { getBenefitsForMotivations } from '@/src/constants/benefits';
import { getSymptomsForKeys } from '@/src/constants/symptoms';
import { useAchievements } from '@/src/hooks/useAchievements';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useAuthStore } from '@/src/stores/authStore';
import { Ionicons } from '@expo/vector-icons';
import { differenceInCalendarDays, differenceInMinutes } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { Easing, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

type ActiveTab = 'goals' | 'symptoms';

function formatDaysRemaining(days: number): string {
  if (days <= 0) return 'Any moment now';
  if (days === 1) return '1 day to go';
  if (days < 30) return `${days} days to go`;
  const months = Math.round(days / 30);
  if (months === 1) return '1 month to go';
  if (months < 12) return `${months} months to go`;
  const years = Math.round(days / 365);
  return `${years} year${years > 1 ? 's' : ''} to go`;
}

export default function TimelineScreen() {
  const { profile } = useAuthStore();
  const colors = useThemeColors();
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [symptomSelectorVisible, setSymptomSelectorVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('goals');
  const [milestoneModalVisible, setMilestoneModalVisible] = useState(false);

  // Animation Re-Trigger State
  const [animationKey, setAnimationKey] = useState(0);

  // Overlay State (For demonstration, we use a single hardcoded celebration 
  // until fully wired up with the achievement store listener)
  const [achievementModalVisible, setAchievementModalVisible] = useState(false);
  const [latestAchievementTitle, setLatestAchievementTitle] = useState('Three Strong');
  const [latestAchievementDesc, setLatestAchievementDesc] = useState('You have been nicotine-free for 3 entire days. Your body is now 100% clean!');
  const [latestAchievementIcon, setLatestAchievementIcon] = useState<any>('flame');

  // Triggering the overlay based on achievements (Simplified simulation for the prompt)
  const { achievements } = useAchievements();
  useEffect(() => {
    // If we wanted to check if they literally *just* unlocked "streak_3d" we would read the store.
    // For demonstration, we simply pop it up if they have any achievements.
    // Replace this block with a Zustand listener for 'onUnlock' in production.
    if (achievements.length > 0) {
      const topAchieveObj = ACHIEVEMENTS.find(a => a.key === achievements[0].achievement_key);
      if (topAchieveObj && animationKey === 0) {
        // Only show on first mount, in reality, use an async storage flag 'hasSeenAchievement_xyz'
        setLatestAchievementTitle(topAchieveObj.title);
        setLatestAchievementDesc(topAchieveObj.description);
        setLatestAchievementIcon(topAchieveObj.icon);
        // Uncomment below to naturally test the pop-up on page load
        // setAchievementModalVisible(true); 
      }
    }
  }, [achievements, animationKey]);

  const handleCloseOverlay = () => {
    setAchievementModalVisible(false);
    // Setting a new key instantly remounts the children, retriggering all 
    // native Reanimated timing/spring animations beautifully.
    setAnimationKey(prev => prev + 1);
  };

  const motivations = profile?.motivations ?? [];
  const hasMotivations = motivations.length > 0;
  const trackedSymptoms = profile?.tracked_symptoms ?? [];
  const hasSymptoms = trackedSymptoms.length > 0;

  if (!profile?.quit_date) {
    return (
      <AnimatedSkyBackground>
        <SafeAreaView className="flex-1" edges={['top']}>
          <View className="flex-1 items-center justify-center px-8">
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', marginBottom: 8 }}>
              Set your quit date to see your progress
            </Text>
            <Text style={{ fontSize: 16, color: colors.textMuted, textAlign: 'center' }}>
              Head to Profile to set your quit date and track your recovery
              journey.
            </Text>
          </View>
        </SafeAreaView>
      </AnimatedSkyBackground>
    );
  }

  const quitDate = new Date(profile.quit_date);
  const now = new Date();
  const minutesSinceQuit = differenceInMinutes(now, quitDate);
  const daysFree = Math.max(0, differenceInCalendarDays(now, quitDate));

  // Compute percentage toward next milestone
  const nextMilestoneIdx = MILESTONES.findIndex(
    (m) => minutesSinceQuit < m.minutes,
  );
  let percentage: number;
  let nextMilestoneLabel: string | undefined;

  if (nextMilestoneIdx === -1) {
    percentage = 100;
  } else if (nextMilestoneIdx === 0) {
    percentage = (minutesSinceQuit / MILESTONES[0].minutes) * 100;
    nextMilestoneLabel = MILESTONES[0].label;
  } else {
    const next = MILESTONES[nextMilestoneIdx];
    percentage = (minutesSinceQuit / next.minutes) * 100;
    nextMilestoneLabel = next.label;
  }

  // Next incomplete goal (closest to completion first)
  const nextGoal = useMemo(() => {
    if (!hasMotivations) return null;
    const benefits = getBenefitsForMotivations(motivations);
    const incomplete = benefits
      .filter((b) => daysFree < b.timelineDays)
      .sort((a, b) => a.timelineDays - b.timelineDays);
    return incomplete[0] ?? null;
  }, [motivations, hasMotivations, daysFree]);

  // Next incomplete symptom recovery (closest to recovery first)
  const nextSymptom = useMemo(() => {
    if (!hasSymptoms) return null;
    const symptoms = getSymptomsForKeys(trackedSymptoms);
    const incomplete = symptoms
      .filter((s) => daysFree < s.recoveryDays)
      .sort((a, b) => a.recoveryDays - b.recoveryDays);
    return incomplete[0] ?? null;
  }, [trackedSymptoms, hasSymptoms, daysFree]);

  const nextItem = activeTab === 'goals' ? nextGoal : nextSymptom;
  const nextItemDays = nextItem
    ? ('timelineDays' in nextItem ? nextItem.timelineDays : nextItem.recoveryDays)
    : null;
  const nextItemProgress = nextItemDays ? Math.min(daysFree / nextItemDays, 1) : null;
  const nextItemDaysRemaining = nextItemDays ? Math.max(nextItemDays - daysFree, 0) : null;

  return (
    <AnimatedSkyBackground>
      <View className="flex-1">
        {/* Hero Image - full bleed to top edge */}
        <View style={{ height: 220, marginTop: -10 }}>
          <Image
            source={require('@/assets/images/scene-sunrise-hero.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', '#0d0b2e']}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60 }}
          />
          <SafeAreaView className="absolute top-0 left-0 right-0" edges={['top']}>
            <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
              <ScreenTitle>Recovery</ScreenTitle>
              <Pressable
                onPress={() => setMilestoneModalVisible(true)}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 6,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
                }}
              >
                <Ionicons name="flag" size={16} color="#c4b5fd" />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: 'rgba(255,255,255,0.9)',
                  }}
                >
                  {daysFree}d
                </Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>

        <ScrollView className="flex-1 px-4 pt-6" contentContainerClassName="pb-12">
          {/* The key prop perfectly handles "unmounting" and "remounting" these subcomponents
            when tracking milestones finish, retriggering all inner useEffect() animations natively */}
          <Animated.View entering={FadeInDown.delay(100).duration(600).easing(Easing.out(Easing.cubic))}>
            <RecoveryRing key={`ring-${animationKey}`} percentage={percentage} daysFree={daysFree} nextMilestoneLabel={nextMilestoneLabel} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(600).easing(Easing.out(Easing.cubic))}>
            <JourneyBar key={`bar-${animationKey}`} minutesSinceQuit={minutesSinceQuit} />
          </Animated.View>

          {/* Next goal/symptom preview */}
          {nextItem && nextItemProgress !== null && nextItemDaysRemaining !== null && (
            <Animated.View
              entering={FadeInDown.delay(300).duration(600).easing(Easing.out(Easing.cubic))}
              style={{
                backgroundColor: colors.isDark ? colors.cardBg : '#f5f3ff',
                borderWidth: colors.isDark ? 1 : 0,
                borderColor: colors.borderColor,
                borderRadius: 16,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 24,
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: colors.isDark ? 'rgba(124,58,237,0.15)' : '#ede9fe',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 24 }}>{nextItem.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: colors.isDark ? '#a78bfa' : '#7c3aed' }}>
                  {activeTab === 'goals' ? 'Next Goal' : 'Next Recovery'}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary }}>
                  {nextItem.title}
                </Text>
                <Text style={{ fontSize: 14, color: colors.isDark ? '#8580a8' : '#8b5cf6' }}>
                  {formatDaysRemaining(nextItemDaysRemaining)}
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Tab bar */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(600).easing(Easing.out(Easing.cubic))}
            style={{
              flexDirection: 'row',
              backgroundColor: colors.elevatedBg,
              borderRadius: 12,
              padding: 4,
              marginBottom: 20,
            }}
          >
            {(['goals', 'symptoms'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 10,
                    backgroundColor: isActive
                      ? colors.isDark ? 'rgba(255,255,255,0.12)' : '#ffffff'
                      : 'transparent',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                      color: isActive ? colors.textPrimary : colors.textMuted,
                    }}
                  >
                    {tab === 'goals' ? 'Goals' : 'Symptoms'}
                  </Text>
                </Pressable>
              );
            })}
          </Animated.View>

          <Animated.View layout={LinearTransition.duration(300)} entering={FadeInDown.delay(500).duration(600).easing(Easing.out(Easing.cubic))}>
            {activeTab === 'goals' ? (
              <>
                {hasMotivations ? (
                  <BenefitsList motivations={motivations} daysFree={daysFree} onEdit={() => setSelectorVisible(true)} />
                ) : (
                  <Pressable
                    onPress={() => setSelectorVisible(true)}
                    style={{
                      borderWidth: 1,
                      borderColor: colors.isDark ? 'rgba(160,150,220,0.2)' : colors.borderColor,
                      borderRadius: 16,
                      backgroundColor: colors.isDark ? 'rgba(160,150,220,0.06)' : colors.cardBg,
                      padding: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 24,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 }}>
                        Set your recovery goals
                      </Text>
                      <Text style={{ fontSize: 14, color: colors.textMuted }}>
                        Track your progress toward the benefits that matter to you
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                  </Pressable>
                )}
              </>
            ) : (
              <>
                {hasSymptoms ? (
                  <SymptomRecoveryList
                    trackedSymptoms={trackedSymptoms}
                    daysFree={daysFree}
                    onEdit={() => setSymptomSelectorVisible(true)}
                  />
                ) : (
                  <Pressable
                    onPress={() => setSymptomSelectorVisible(true)}
                    style={{
                      borderWidth: 1,
                      borderColor: colors.isDark ? 'rgba(160,150,220,0.2)' : colors.borderColor,
                      borderRadius: 16,
                      backgroundColor: colors.isDark ? 'rgba(160,150,220,0.06)' : colors.cardBg,
                      padding: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 24,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 }}>
                        Track your withdrawal symptoms
                      </Text>
                      <Text style={{ fontSize: 14, color: colors.textMuted }}>
                        Monitor your recovery from withdrawal symptoms over time
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                  </Pressable>
                )}
              </>
            )}
          </Animated.View>
        </ScrollView>

        {/* Helper Component Overlays */}
        <BenefitSelectorModal
          visible={selectorVisible}
          onClose={() => setSelectorVisible(false)}
          initialSelections={motivations}
        />

        <SymptomSelectorModal
          visible={symptomSelectorVisible}
          onClose={() => setSymptomSelectorVisible(false)}
          initialSelections={trackedSymptoms}
        />

        <MilestoneCelebrationModal
          visible={milestoneModalVisible}
          onClose={() => setMilestoneModalVisible(false)}
          daysFree={daysFree}
          minutesSinceQuit={minutesSinceQuit}
        />

        {/* Global Achievement Trigger Modal */}
        <AchievementOverlay
          visible={achievementModalVisible}
          onClose={handleCloseOverlay}
          title={latestAchievementTitle}
          description={latestAchievementDesc}
          iconName={latestAchievementIcon}
        />
      </View>
    </AnimatedSkyBackground>
  );
}
