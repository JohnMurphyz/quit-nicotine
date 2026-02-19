import { View, Text } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

type Phase = 'inhale' | 'hold' | 'exhale';

const PHASE_DURATION = 4000; // 4 seconds per phase
const PHASES: { phase: Phase; label: string }[] = [
  { phase: 'inhale', label: 'Breathe In' },
  { phase: 'hold', label: 'Hold' },
  { phase: 'exhale', label: 'Breathe Out' },
];

export function BreathingExercise() {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const currentPhase = PHASES[currentPhaseIndex];

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentPhaseIndex((prev) => {
        const next = (prev + 1) % PHASES.length;
        if (next === 0) setCycles((c) => c + 1);
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        return next;
      });
    }, PHASE_DURATION);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const circleSize = currentPhase.phase === 'inhale'
    ? 'w-48 h-48'
    : currentPhase.phase === 'hold'
    ? 'w-48 h-48'
    : 'w-32 h-32';

  const circleColor = currentPhase.phase === 'inhale'
    ? 'bg-blue-100'
    : currentPhase.phase === 'hold'
    ? 'bg-blue-200'
    : 'bg-blue-50';

  return (
    <View className="items-center">
      <View className={`${circleSize} ${circleColor} rounded-full items-center justify-center`}>
        <Text className="text-2xl font-bold text-blue-700">
          {currentPhase.label}
        </Text>
      </View>
      <Text className="text-sm text-warm-300 mt-4">
        Cycle {cycles + 1}
      </Text>
    </View>
  );
}
