import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useEffect } from 'react';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

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
  breathDuration = 4000,
  rotateDuration = 20000,
}: BreathingOrbProps) {
  const colors = useThemeColors();

  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0.85);
  const rotationSlow = useSharedValue(0);
  const rotationFast = useSharedValue(0);

  // Van Gogh "Starry Night" inspired folksy color depth
  // Deep indigos, cerulean blues, sunflower yellows, and soft luminous whites.
  const isDark = colors.isDark;
  const p = {
    bgInner: isDark ? '#1e3a8a' : '#3b82f6',     // Rich Blue
    bgOuter: isDark ? '#0f172a' : '#1e3a8a',     // Deep Night
    swirl1Inner: isDark ? '#0284c7' : '#7dd3fc', // Cerulean / Sky
    swirl1Outer: isDark ? '#0369a1' : '#0284c7',
    swirl2Inner: isDark ? '#fbbf24' : '#fcd34d', // Warm Gold
    swirl2Outer: isDark ? '#d97706' : '#fb923c', // Deep Amber
    coreInner: isDark ? '#fef08a' : '#ffffff',   // Luminous Starlight
    coreOuter: isDark ? '#eab308' : '#fef08a',   // Bright Yellow
  };

  // Slightly imperfect circles (organic folksy feel)
  // Swirl 1 (Blue/Teal nebula)
  const s1Rx = useSharedValue(75);
  const s1Ry = useSharedValue(65);
  const s1Cx = useSharedValue(90);
  const s1Cy = useSharedValue(110);

  // Swirl 2 (Golden starburst)
  const s2Rx = useSharedValue(55);
  const s2Ry = useSharedValue(60);
  const s2Cx = useSharedValue(120);
  const s2Cy = useSharedValue(80);

  // Core luminous star
  const coreRx = useSharedValue(30);
  const coreRy = useSharedValue(32);
  const coreCx = useSharedValue(105);
  const coreCy = useSharedValue(95);

  useEffect(() => {
    // Majestic Breathing pulse
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: breathDuration, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.95, { duration: breathDuration, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1.0, { duration: breathDuration, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.8, { duration: breathDuration, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );

    // Swirling rotation
    rotationSlow.value = withRepeat(
      withTiming(360, { duration: rotateDuration, easing: Easing.linear }),
      -1,
    );
    rotationFast.value = withRepeat(
      withTiming(-360, { duration: rotateDuration * 0.7, easing: Easing.linear }),
      -1,
    );

    // Organic morphing of the circular blobs
    // Keeping ranges tight so they remain circle-like, just gently undulating
    morphLoop(s1Rx, 65, 85, 4000, 7000);
    morphLoop(s1Ry, 60, 80, 4500, 7500);
    morphLoop(s1Cx, 80, 100, 5000, 8000);
    morphLoop(s1Cy, 100, 120, 5500, 8500);

    morphLoop(s2Rx, 45, 65, 3500, 6500);
    morphLoop(s2Ry, 50, 70, 4000, 7000);
    morphLoop(s2Cx, 110, 130, 4500, 7500);
    morphLoop(s2Cy, 70, 90, 5000, 8000);

    morphLoop(coreRx, 25, 40, 3000, 5000);
    morphLoop(coreRy, 28, 42, 3500, 5500);
    morphLoop(coreCx, 95, 115, 4000, 6000);
    morphLoop(coreCy, 85, 105, 4500, 6500);

  }, [
    breathDuration, rotateDuration,
    scale, opacity, rotationSlow, rotationFast,
    s1Rx, s1Ry, s1Cx, s1Cy,
    s2Rx, s2Ry, s2Cx, s2Cy,
    coreRx, coreRy, coreCx, coreCy,
  ]);

  const breathStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const rotateSlowStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotationSlow.value}deg` }] }));
  const rotateFastStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotationFast.value}deg` }] }));

  const s1Props = useAnimatedProps(() => ({ rx: s1Rx.value, ry: s1Ry.value, cx: s1Cx.value, cy: s1Cy.value }));
  const s2Props = useAnimatedProps(() => ({ rx: s2Rx.value, ry: s2Ry.value, cx: s2Cx.value, cy: s2Cy.value }));
  const coreProps = useAnimatedProps(() => ({ rx: coreRx.value, ry: coreRy.value, cx: coreCx.value, cy: coreCy.value }));

  // Helper to generate the soft radial gradients typical of his glowing stars
  const renderGradient = (id: string, inner: string, outer: string, outerOpacity = "0") => (
    <RadialGradient id={id} cx="50%" cy="50%" r="50%">
      <Stop offset="0%" stopColor={inner} stopOpacity="1" />
      <Stop offset="40%" stopColor={inner} stopOpacity="0.8" />
      <Stop offset="100%" stopColor={outer} stopOpacity={outerOpacity} />
    </RadialGradient>
  );

  return (
    <Animated.View style={[{ width: size, height: size }, breathStyle]}>

      {/* Background Deep Sky */}
      <Svg width={size} height={size} viewBox="0 0 200 200" style={{ position: 'absolute' }}>
        <Defs>
          <RadialGradient id="bg" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={p.bgInner} stopOpacity="0.8" />
            <Stop offset="70%" stopColor={p.bgOuter} stopOpacity="0.6" />
            <Stop offset="100%" stopColor={p.bgOuter} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Ellipse cx={100} cy={100} rx={95} ry={95} fill="url(#bg)" />
      </Svg>

      {/* Layer 1: Slow sweeping cool blues */}
      <Animated.View style={[{ position: 'absolute', width: size, height: size }, rotateSlowStyle]}>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Defs>
            {renderGradient('swirl1', p.swirl1Inner, p.swirl1Outer)}
            {/* Additional texture dots/blobs */}
            {renderGradient('swirl1-accent', p.bgInner, p.swirl1Inner)}
          </Defs>
          <AnimatedEllipse fill="url(#swirl1)" animatedProps={s1Props} />

          {/* Secondary smaller swirls for texture */}
          <Ellipse cx={60} cy={80} rx={30} ry={30} fill="url(#swirl1-accent)" opacity={0.6} />
          <Ellipse cx={140} cy={140} rx={40} ry={35} fill="url(#swirl1-accent)" opacity={0.4} />
        </Svg>
      </Animated.View>

      {/* Layer 2: Faster rotating warm golds to create dynamic contrast */}
      <Animated.View style={[{ position: 'absolute', width: size, height: size }, rotateFastStyle]}>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Defs>
            {renderGradient('swirl2', p.swirl2Inner, p.swirl2Outer)}
            {renderGradient('swirl2-accent', p.swirl2Outer, p.swirl2Inner, "0.2")}
          </Defs>
          <AnimatedEllipse fill="url(#swirl2)" animatedProps={s2Props} opacity={0.85} />

          {/* Secondary gold accents */}
          <Ellipse cx={150} cy={60} rx={25} ry={25} fill="url(#swirl2-accent)" opacity={0.7} />
          <Ellipse cx={50} cy={150} rx={20} ry={20} fill="url(#swirl2-accent)" opacity={0.5} />
        </Svg>
      </Animated.View>

      {/* Layer 3: Central Luminous Starlight Core */}
      <Animated.View style={[{ position: 'absolute', width: size, height: size }, rotateSlowStyle]}>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Defs>
            {renderGradient('core', p.coreInner, p.coreOuter, "0.1")}
          </Defs>
          {/* The bright burning core of the star */}
          <AnimatedEllipse fill="url(#core)" animatedProps={coreProps} />
        </Svg>
      </Animated.View>

    </Animated.View>
  );
}
