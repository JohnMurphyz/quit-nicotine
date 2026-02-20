import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useEffect } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

// Because RN TextInput cross-platform reanimated props can be tricky, we add text to whitelisted native props
Animated.addWhitelistedNativeProps({ text: true });

interface RecoveryRingProps {
  percentage: number; // 0–100
  daysFree: number;
  nextMilestoneLabel?: string;
}

const SIZE = 240;
const PROGRESS_STROKE = 18;
const TRACK_STROKE = 2;
// The trail (motion blur simulator) is wider but soft
const BLUR_STROKE = 24;
const RADIUS = (SIZE - PROGRESS_STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function RecoveryRing({ percentage, daysFree, nextMilestoneLabel }: RecoveryRingProps) {
  const colors = useThemeColors();

  const clamped = Math.min(100, Math.max(0, percentage));
  const targetOffset = CIRCUMFERENCE * (1 - clamped / 100);

  // We start empty (offset = full circumference, number = 0)
  const animatedOffset = useSharedValue(CIRCUMFERENCE);
  // Trail offset starts completely empty too, but we animate it slightly slower
  const trailOffset = useSharedValue(CIRCUMFERENCE);
  const animatedNumber = useSharedValue(0);

  useEffect(() => {
    // Elegant, smooth animation easing out rapidly
    const dur = 2000;

    // Draw main ring
    animatedOffset.value = withTiming(targetOffset, {
      duration: dur,
      easing: Easing.out(Easing.exp)
    });

    // Draw the "motion blur" trailing line slightly slower and delayed 
    // so it 'smears' the edge of the line as it moves fast, then catches up and hides
    trailOffset.value = withDelay(
      50,
      withTiming(targetOffset, {
        duration: dur * 1.05,
        easing: Easing.out(Easing.exp)
      })
    );

    // Animate the number counting up
    animatedNumber.value = withTiming(clamped, {
      duration: dur,
      easing: Easing.out(Easing.exp)
    });
  }, [percentage, clamped, targetOffset, animatedOffset, trailOffset, animatedNumber]);

  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: animatedOffset.value,
    };
  });

  const trailCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: trailOffset.value,
    };
  });

  const animatedTextProps = useAnimatedProps(() => {
    return {
      text: `${Math.round(animatedNumber.value)}%`,
    } as any; // 'text' works natively behind the scenes for TextInput in RN iOS/Android
  });

  return (
    <View className="items-center py-6">
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <Defs>
            <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#22c55e" />
              <Stop offset="1" stopColor="#34d8ac" />
            </LinearGradient>
            {/* Softer gradient for the motion blur trail */}
            <LinearGradient id="blurGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#22c55e" stopOpacity="0.4" />
              <Stop offset="1" stopColor="#34d8ac" stopOpacity="0.1" />
            </LinearGradient>
          </Defs>

          {/* Thin background track */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={colors.borderColor}
            strokeWidth={TRACK_STROKE}
            fill="none"
          />

          {/* "Motion Blur" Trail arc */}
          {/* We render it underneath the main stroke. Because it lags slightly behind,
              it stretches out from the tip while moving fast, then vanishes under 
              the main stroke when it catches up. */}
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="url(#blurGrad)"
            strokeWidth={BLUR_STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={trailCircleProps}
            rotation={-90}
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />

          {/* Thick main progress arc */}
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="url(#ringGrad)"
            strokeWidth={PROGRESS_STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={animatedCircleProps}
            rotation={-90}
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>

        {/* Center text overlay */}
        <View
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          className="items-center justify-center pointer-events-none"
          pointerEvents="none"
        >
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textMuted, letterSpacing: 2 }}>
            RECOVERY
          </Text>

          {/* The animated number uses TextInput as it can accept the 'text' prop directly from the UI thread 
              without causing slow React re-renders */}
          <AnimatedTextInput
            editable={false}
            animatedProps={animatedTextProps}
            defaultValue="0%"
            style={[styles.animatedNumber, { color: colors.textPrimary }]}
          />

          <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textSecondary, marginTop: -4 }}>
            {daysFree} {daysFree === 1 ? 'DAY' : 'DAYS'} FREE
          </Text>

          {nextMilestoneLabel && (
            <Text style={{ fontSize: 10, fontWeight: '600', color: colors.textMuted, letterSpacing: 2, marginTop: 4 }}>
              NEXT: {nextMilestoneLabel.toUpperCase()}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  animatedNumber: {
    fontSize: 48,
    fontWeight: '700',
    padding: 0,
    margin: 0,
    textAlign: 'center',
    width: '100%',
  },
});
