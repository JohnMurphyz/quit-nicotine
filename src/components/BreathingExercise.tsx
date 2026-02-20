import { useThemeColors } from '@/src/hooks/useThemeColors';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
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

type Phase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

const PHASE_MS = 4500;
const HOLD_MS = 2500;
const CIRCLE_SIZE = 280;
const MAX_RADIUS = 120;
const MIN_RADIUS = 40;

const PHASES: { key: Phase; label: string; duration: number; targetR: number }[] = [
  { key: 'inhale', label: 'Breathe In...', duration: PHASE_MS, targetR: MAX_RADIUS },
  { key: 'holdIn', label: 'Hold...', duration: HOLD_MS, targetR: MAX_RADIUS + 4 }, // slight over-expansion for breath hold
  { key: 'exhale', label: 'Breathe Out...', duration: PHASE_MS, targetR: MIN_RADIUS },
  { key: 'holdOut', label: 'Rest...', duration: HOLD_MS, targetR: MIN_RADIUS },
];

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function BreathingExercise() {
  const colors = useThemeColors();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycles, setCycles] = useState(0);

  const radius = useSharedValue(MIN_RADIUS);
  const intervalRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const phase = PHASES[phaseIndex];

  useEffect(() => {
    // Animate the size based on phase
    const isHold = phase.key === 'holdIn' || phase.key === 'holdOut';

    // Smooth Sine easing for natural breathing mechanics
    radius.value = withTiming(phase.targetR, {
      duration: phase.duration,
      easing: isHold ? Easing.inOut(Easing.quad) : Easing.inOut(Easing.sin),
    });

    // Schedule next phase
    intervalRef.current = setTimeout(() => {
      setPhaseIndex((prev) => {
        const next = (prev + 1) % PHASES.length;
        if (next === 0) setCycles((c) => c + 1);

        if (Platform.OS !== 'web') {
          // Soft feedback on breath transitions
          if (PHASES[next].key === 'inhale' || PHASES[next].key === 'exhale') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }
        return next;
      });
    }, phase.duration);

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [phaseIndex, phase.duration, phase.targetR, phase.key]);

  // We create 3 rings for a soft, glowing, hypnotic effect
  const ring1Props = useAnimatedProps(() => ({ r: radius.value }));
  const ring2Props = useAnimatedProps(() => ({ r: Math.max(0, radius.value - 15) }));
  const ring3Props = useAnimatedProps(() => ({ r: Math.max(0, radius.value - 30) }));

  const outerOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(radius.value, [MIN_RADIUS, MAX_RADIUS], [0.1, 0.4])
    };
  });

  const baseColor = colors.isDark ? '#8b5cf6' : '#7c3aed'; // Deep purple to match purple theme of screenshot

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
        <Animated.Text
          key={phase.key} // Forces unmount/remount for fade effect
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(400)}
          style={{
            fontSize: 24,
            fontWeight: '600',
            color: colors.textPrimary,
            textAlign: 'center',
            letterSpacing: 1.5,
            position: 'absolute'
          }}
        >
          {phase.label}
        </Animated.Text>
      </View>

      <Animated.Text style={{ fontSize: 16, color: colors.textMuted, marginTop: 12, letterSpacing: 2, fontWeight: '500' }}>
        CYCLE {cycles + 1}
      </Animated.Text>

    </View>
  );
}
