import { useMemo } from 'react';
import { differenceInMinutes } from 'date-fns';
import { useAuthStore } from '@/src/stores/authStore';
import { TIMELINE_MILESTONES, type TimelineMilestone } from '@/src/constants/timeline';

export interface TimelineItem extends TimelineMilestone {
  passed: boolean;
  unlockedAt: Date | null;
  minutesRemaining: number;
}

export function useTimeline() {
  const { profile } = useAuthStore();

  const items = useMemo((): TimelineItem[] => {
    if (!profile?.quit_date) return [];

    const quitDate = new Date(profile.quit_date);
    const now = new Date();
    const minutesSinceQuit = differenceInMinutes(now, quitDate);

    return TIMELINE_MILESTONES.map((milestone) => {
      const passed = minutesSinceQuit >= milestone.minutes;
      const unlockedAt = passed
        ? new Date(quitDate.getTime() + milestone.minutes * 60 * 1000)
        : null;
      const minutesRemaining = passed ? 0 : milestone.minutes - minutesSinceQuit;

      return {
        ...milestone,
        passed,
        unlockedAt,
        minutesRemaining,
      };
    });
  }, [profile?.quit_date]);

  const nextMilestone = useMemo(() => {
    return items.find((item) => !item.passed) ?? null;
  }, [items]);

  const passedCount = useMemo(() => {
    return items.filter((item) => item.passed).length;
  }, [items]);

  return { items, nextMilestone, passedCount };
}
