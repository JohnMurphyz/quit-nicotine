import { View, Text, ScrollView, Pressable } from 'react-native';
import { useState, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { differenceInMinutes, differenceInCalendarDays } from 'date-fns';
import { useAuthStore } from '@/src/stores/authStore';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { RecoveryRing } from '@/src/components/RecoveryRing';
import { JourneyBar, MILESTONES } from '@/src/components/JourneyBar';
import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { BenefitsList } from '@/src/components/BenefitsList';
import { BenefitSelectorModal } from '@/src/components/BenefitSelectorModal';
import { SymptomRecoveryList } from '@/src/components/SymptomRecoveryList';
import { SymptomSelectorModal } from '@/src/components/SymptomSelectorModal';
import { getBenefitsForMotivations } from '@/src/constants/benefits';
import { getSymptomsForKeys } from '@/src/constants/symptoms';

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

  const motivations = profile?.motivations ?? [];
  const hasMotivations = motivations.length > 0;
  const trackedSymptoms = profile?.tracked_symptoms ?? [];
  const hasSymptoms = trackedSymptoms.length > 0;

  if (!profile?.quit_date) {
    return (
      <AnimatedSkyBackground>
      <SafeAreaView className="flex-1">
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
  const daysFree = differenceInCalendarDays(now, quitDate);

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
    const prev = MILESTONES[nextMilestoneIdx - 1];
    const next = MILESTONES[nextMilestoneIdx];
    percentage =
      ((minutesSinceQuit - prev.minutes) / (next.minutes - prev.minutes)) *
      100;
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
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 px-4 pt-6" contentContainerClassName="pb-12">
        <Text style={{ fontSize: 24, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 }}>
          Recovery
        </Text>

        <RecoveryRing percentage={percentage} daysFree={daysFree} nextMilestoneLabel={nextMilestoneLabel} />

        <JourneyBar minutesSinceQuit={minutesSinceQuit} />

        {/* Next goal/symptom preview */}
        {nextItem && nextItemProgress !== null && nextItemDaysRemaining !== null && (
          <View
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
          </View>
        )}

        {/* Tab bar */}
        <View
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
        </View>

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
      </ScrollView>

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
    </SafeAreaView>
    </AnimatedSkyBackground>
  );
}
