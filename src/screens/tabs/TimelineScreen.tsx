import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { differenceInMinutes, differenceInCalendarDays } from 'date-fns';
import { useTimeline } from '@/src/hooks/useTimeline';
import { useAuthStore } from '@/src/stores/authStore';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { RecoveryRing } from '@/src/components/RecoveryRing';
import { JourneyBar, MILESTONES } from '@/src/components/JourneyBar';
import { MilestonePreview } from '@/src/components/MilestonePreview';
import { TimelineItemRow } from '@/src/components/TimelineItem';
import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';

export default function TimelineScreen() {
  const { profile } = useAuthStore();
  const { items, nextMilestone } = useTimeline();
  const colors = useThemeColors();

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

  return (
    <AnimatedSkyBackground>
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 px-4 pt-6" contentContainerClassName="pb-12">
        <Text style={{ fontSize: 24, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 }}>
          Recovery
        </Text>

        <RecoveryRing percentage={percentage} daysFree={daysFree} nextMilestoneLabel={nextMilestoneLabel} />

        <JourneyBar minutesSinceQuit={minutesSinceQuit} />

        {nextMilestone && (
          <View className="mb-6">
            <MilestonePreview milestone={nextMilestone} />
          </View>
        )}

        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 16 }}>
          Health Timeline
        </Text>
        {items.map((item, index) => (
          <TimelineItemRow
            key={item.id}
            item={item}
            isLast={index === items.length - 1}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
    </AnimatedSkyBackground>
  );
}
