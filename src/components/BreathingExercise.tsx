import { useThemeColors } from '@/src/hooks/useThemeColors';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

export type Phase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

export interface BreathingPhase {
  key: Phase;
  label: string;
  durationMS: number;
}

export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  phases: BreathingPhase[];
  color: string;
}

export const BREATHING_PATTERNS: Record<string, BreathingPattern> = {
  calm: {
    id: 'calm',
    name: 'Box Breathing',
    description: '4s In • 4s Hold • 4s Out • 4s Hold',
    color: '#3b82f6', // blue
    phases: [
      { key: 'inhale', label: 'Breathe In...', durationMS: 4000 },
      { key: 'holdIn', label: 'Hold...', durationMS: 4000 },
      { key: 'exhale', label: 'Breathe Out...', durationMS: 4000 },
      { key: 'holdOut', label: 'Rest...', durationMS: 4000 },
    ],
  },
  sleep: {
    id: 'sleep',
    name: '4-7-8 Sleep',
    description: '4s In • 7s Hold • 8s Out',
    color: '#8b5cf6', // purple
    phases: [
      { key: 'inhale', label: 'Breathe In...', durationMS: 4000 },
      { key: 'holdIn', label: 'Hold...', durationMS: 7000 },
      { key: 'exhale', label: 'Breathe Out...', durationMS: 8000 },
      { key: 'holdOut', label: 'Rest...', durationMS: 0 },
    ],
  },
  awake: {
    id: 'awake',
    name: 'Energize',
    description: '6s In • 0s Hold • 2s Out',
    color: '#f59e0b', // amber
    phases: [
      { key: 'inhale', label: 'Deep Inhale...', durationMS: 6000 },
      { key: 'holdIn', label: '', durationMS: 0 },
      { key: 'exhale', label: 'Quick Exhale!', durationMS: 2000 },
      { key: 'holdOut', label: '', durationMS: 0 },
    ],
  },
};

const CIRCLE_SIZE = 280;
const MAX_RADIUS = 120;
const MIN_RADIUS = 40;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function BreathingExercise({ pattern = BREATHING_PATTERNS.calm }: { pattern?: BreathingPattern }) {
  const colors = useThemeColors();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycles, setCycles] = useState(0);

  const radius = useSharedValue(MIN_RADIUS);
  const intervalRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Rebuild functional phases based on the injected pattern, stripping out 0-duration phases
  const activePhases = pattern.phases
    .filter(p => p.durationMS > 0)
    .map(p => {
      let targetR = MIN_RADIUS;
      if (p.key === 'inhale') targetR = MAX_RADIUS;
      if (p.key === 'holdIn') targetR = MAX_RADIUS + 4;
      return { ...p, targetR };
    });

  const phase = activePhases[phaseIndex % activePhases.length];

  // Reset breathing cycle whenever pattern changes
  useEffect(() => {
    setPhaseIndex(0);
    setCycles(0);
    radius.value = MIN_RADIUS;
  }, [pattern.id]);

  useEffect(() => {
    if (!phase) return;

    // Animate the size based on phase
    const isHold = phase.key === 'holdIn' || phase.key === 'holdOut';

    // Smooth Sine easing for natural breathing mechanics
    radius.value = withTiming(phase.targetR, {
      duration: phase.durationMS,
      easing: isHold ? Easing.inOut(Easing.quad) : Easing.inOut(Easing.sin),
    });

    // Schedule next phase
    intervalRef.current = setTimeout(() => {
      setPhaseIndex((prev) => {
        const next = (prev + 1) % activePhases.length;
        if (next === 0) setCycles((c) => c + 1);

        if (Platform.OS !== 'web') {
          // Soft feedback on breath transitions
          if (activePhases[next].key === 'inhale' || activePhases[next].key === 'exhale') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }
        return next;
      });
    }, phase.durationMS);

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [phaseIndex, phase.durationMS, phase.targetR, phase.key]);

  // We create 3 rings for a soft, glowing, hypnotic effect
  const ring1Props = useAnimatedProps(() => ({ r: radius.value }));
  const ring2Props = useAnimatedProps(() => ({ r: Math.max(0, radius.value - 15) }));
  const ring3Props = useAnimatedProps(() => ({ r: Math.max(0, radius.value - 30) }));

  const outerOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(radius.value, [MIN_RADIUS, MAX_RADIUS], [0.1, 0.4])
    };
  });

  const baseColor = pattern.color;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>

      {/* 1. The Breathing Rings */}
      <View style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, alignItems: 'center', justifyContent: 'center' }}>

        {/* Soft SVG Glowing Rings */}
        <Animated.View style={[{ position: 'absolute' }, outerOpacity]}>
          <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}>
            <Defs>
              <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor={baseColor} stopOpacity="0.8" />
                <Stop offset="100%" stopColor={baseColor} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <AnimatedCircle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              fill="url(#glow)"
              animatedProps={ring1Props}
            />
          </Svg>
        </Animated.View>

        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`} style={{ position: 'absolute' }}>
          <AnimatedCircle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            fill={baseColor}
            fillOpacity={0.2}
            animatedProps={ring2Props}
          />
          <AnimatedCircle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            fill={baseColor}
            fillOpacity={0.4}
            animatedProps={ring3Props}
          />
        </Svg>
      </View>

      {/* 2. Text Instructions (Moved below the rings) */}
      <View style={{ height: 40, justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
        <Animated.View
          key={phase.key} // Forces unmount/remount for fade effect
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(400)}
          style={{
            position: 'absolute',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: '700', color: baseColor, marginBottom: 4 }}>
            {phase?.label || ''}
          </Text>
          <Text style={{ fontSize: 16, color: colors.textSecondary }}>
            {Math.ceil((phase?.durationMS || 0) / 1000)}s
          </Text>
        </Animated.View>
      </View>

      <Animated.Text style={{ fontSize: 16, color: colors.textMuted, marginTop: 12, letterSpacing: 2, fontWeight: '500' }}>
        CYCLE {cycles + 1}
      </Animated.Text>

    </View>
  );
}
