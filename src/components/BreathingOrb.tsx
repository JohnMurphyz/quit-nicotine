import Svg, { Ellipse, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useThemeColors } from '@/src/hooks/useThemeColors';

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

/** Kick off a looping morph: animate to a random value in [min,max], then recurse. */
function morphLoop(
  sv: SharedValue<number>,
  min: number,
  max: number,
  minDur: number,
  maxDur: number,
) {
  'worklet';
  const target = min + Math.random() * (max - min);
  const dur = minDur + Math.random() * (maxDur - minDur);
  sv.value = withTiming(target, { duration: dur, easing: Easing.inOut(Easing.ease) }, () => {
    morphLoop(sv, min, max, minDur, maxDur);
  });
}

interface BreathingOrbProps {
  size?: number;
  breathDuration?: number;
  rotateDuration?: number;
}

export function BreathingOrb({
  size = 200,
  breathDuration = 3000,
  rotateDuration = 8000,
}: BreathingOrbProps) {
  const colors = useThemeColors();

  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0.85);
  const rotation = useSharedValue(0);

  // Core morph shared values
  const coreRx = useSharedValue(46);
  const coreRy = useSharedValue(49);
  const coreCx = useSharedValue(98);
  const coreCy = useSharedValue(98);

  // Bleed patch morph shared values
  const bleedARx = useSharedValue(28);
  const bleedARy = useSharedValue(24);
  const bleedBRx = useSharedValue(26);
  const bleedBRy = useSharedValue(22);

  // Dark: lavender core → deep violet rim on indigo sky
  // Light: warm amber core → copper rim on cream background
  const coreStart = colors.isDark ? '#c4b5fd' : '#e2b97f';
  const coreEnd = colors.isDark ? '#9b8ec4' : '#c4956a';
  const rimStart = colors.isDark ? '#7c6cb5' : '#a07850';
  const rimEnd = colors.isDark ? '#4a3d80' : '#8b6542';
  const glowInner = colors.isDark ? '#9b8ec4' : '#d4a574';
  const glowOuter = colors.isDark ? '#5c5080' : '#b09060';
  const bleedA = colors.isDark ? '#a898d8' : '#d4a06a';
  const bleedB = colors.isDark ? '#6a5ca0' : '#946840';
  const sheenOpacity = colors.isDark ? '0.35' : '0.25';

  useEffect(() => {
    // Breathing pulse
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: breathDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: breathDuration, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1.0, { duration: breathDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.85, { duration: breathDuration, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );

    // Continuous rotation
    rotation.value = withRepeat(
      withTiming(360, { duration: rotateDuration, easing: Easing.linear }),
      -1,
    );

    // Slow random morphing — gentle drift, tight ranges, long durations
    morphLoop(coreRx, 43, 50, 4000, 7000);
    morphLoop(coreRy, 46, 52, 4500, 7500);
    morphLoop(coreCx, 95, 102, 5000, 8000);
    morphLoop(coreCy, 95, 102, 5500, 8500);

    // Bleed patches drift slowly too
    morphLoop(bleedARx, 24, 31, 5000, 8000);
    morphLoop(bleedARy, 21, 27, 5500, 8500);
    morphLoop(bleedBRx, 23, 29, 6000, 9000);
    morphLoop(bleedBRy, 19, 25, 6500, 9500);
  }, [
    breathDuration, rotateDuration,
    scale, opacity, rotation,
    coreRx, coreRy, coreCx, coreCy,
    bleedARx, bleedARy, bleedBRx, bleedBRy,
  ]);

  const breathStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const coreProps = useAnimatedProps(() => ({
    rx: coreRx.value,
    ry: coreRy.value,
    cx: coreCx.value,
    cy: coreCy.value,
  }));

  const bleedAProps = useAnimatedProps(() => ({
    rx: bleedARx.value,
    ry: bleedARy.value,
  }));

  const bleedBProps = useAnimatedProps(() => ({
    rx: bleedBRx.value,
    ry: bleedBRy.value,
  }));

  return (
    <Animated.View style={[{ width: size, height: size }, breathStyle]}>
      <Animated.View style={[{ width: size, height: size }, rotateStyle]}>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Defs>
            <RadialGradient id="orb-glow" cx="48%" cy="52%" r="50%">
              <Stop offset="0%" stopColor={glowInner} stopOpacity="0.3" />
              <Stop offset="55%" stopColor={glowOuter} stopOpacity="0.1" />
              <Stop offset="100%" stopColor={glowOuter} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="orb-glow2" cx="60%" cy="42%" r="45%">
              <Stop offset="0%" stopColor={bleedA} stopOpacity="0.2" />
              <Stop offset="100%" stopColor={bleedA} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="orb-rim" cx="38%" cy="36%" r="62%">
              <Stop offset="0%" stopColor={rimStart} stopOpacity="0.95" />
              <Stop offset="70%" stopColor={rimEnd} stopOpacity="0.85" />
              <Stop offset="100%" stopColor={rimEnd} stopOpacity="0.5" />
            </RadialGradient>
            <RadialGradient id="orb-core" cx="44%" cy="42%" r="52%">
              <Stop offset="0%" stopColor={coreStart} stopOpacity="1" />
              <Stop offset="65%" stopColor={coreEnd} stopOpacity="0.9" />
              <Stop offset="100%" stopColor={coreEnd} stopOpacity="0.6" />
            </RadialGradient>
            <RadialGradient id="orb-bleed-a" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={bleedA} stopOpacity="0.45" />
              <Stop offset="100%" stopColor={bleedA} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="orb-bleed-b" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={bleedB} stopOpacity="0.35" />
              <Stop offset="100%" stopColor={bleedB} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="orb-sheen" cx="46%" cy="28%" r="48%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity={sheenOpacity} />
              <Stop offset="60%" stopColor="#ffffff" stopOpacity="0.08" />
              <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Glow layers */}
          <Ellipse cx={97} cy={103} rx={92} ry={88} fill="url(#orb-glow)" />
          <Ellipse cx={108} cy={95} rx={78} ry={82} fill="url(#orb-glow2)" />

          {/* Rim */}
          <Ellipse cx={100} cy={101} rx={63} ry={61} fill="url(#orb-rim)" />

          {/* Bleed patches — morph randomly */}
          <AnimatedEllipse cx={118} cy={92} fill="url(#orb-bleed-a)" animatedProps={bleedAProps} />
          <AnimatedEllipse cx={82} cy={112} fill="url(#orb-bleed-b)" animatedProps={bleedBProps} />
          <Ellipse cx={106} cy={116} rx={20} ry={18} fill="url(#orb-bleed-a)" />

          {/* Core — morphs randomly */}
          <AnimatedEllipse fill="url(#orb-core)" animatedProps={coreProps} />

          {/* Sheen */}
          <Ellipse cx={94} cy={84} rx={30} ry={24} fill="url(#orb-sheen)" />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}
