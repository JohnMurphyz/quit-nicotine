import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(SvgText);
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface JourneyBarProps {
  minutesSinceQuit: number;
}

export const MILESTONES = [
  { label: '3 days', minutes: 4320, description: 'Nicotine leaves body' },
  { label: '2 weeks', minutes: 20160, description: 'Circulation improves' },
  { label: '3 months', minutes: 129600, description: 'Lungs recover' },
  { label: '6 months', minutes: 262800, description: 'Cravings ease' },
  { label: '1 year', minutes: 525600, description: 'Heart risk halved' },
];

const VB_W = 300;
const VB_H = 150;
const CURVE_PATH =
  'M 25 24 L 240 24 A 25 25 0 0 1 240 74 L 60 74 A 25 25 0 0 0 60 124 L 285 124';

const TOTAL_LENGTH = 777.08;
const STROKE_W = 5;
const DOT_R = 8;

/* 
  Dynamic layout maps physical distances along the total 777 length track.
  Depending on which milestone you are currently progressing toward (nextIdx), 
  the layouts bunch up past and future milestones to maximize the physical space 
  allocated to your *current* goal, making early progress appear massive visually.
*/
const LAYOUTS = [
  // nextIdx = 0 (Goal is 3 days. Focus entirely on first step, remainder bunched at end)
  [450, 530, 610, 690, 770],
  // nextIdx = 1 (Goal is 2 weeks.)
  [80, 450, 530, 610, 690],
  // nextIdx = 2 (Goal is 3 months.)
  [80, 160, 450, 560, 670],
  // nextIdx = 3
  [80, 160, 240, 450, 600],
  // nextIdx = 4
  [80, 160, 240, 320, 450],
  // nextIdx = -1 (All Achieved. Evenly spread completion state)
  [100, 250, 400, 550, 700],
];

function getPointAtDistance(d: number) {
  'worklet';
  const PI = Math.PI;
  if (d < 0) d = 0;
  if (d > 777.08) d = 777.08;

  let x = 0;
  let y = 0;
  let ly = 0;

  if (d <= 215) {
    x = 25 + d;
    y = 24;
    ly = y + 19;
  } else if (d <= 293.54) {
    const lenOnArc = d - 215;
    const angle = -PI / 2 + (lenOnArc / 25);
    x = 240 + 25 * Math.cos(angle);
    y = 49 + 25 * Math.sin(angle);
    ly = y + (y > 49 ? 18 : -18);
  } else if (d <= 473.54) {
    const lenOnLine = d - 293.54;
    x = 240 - lenOnLine;
    y = 74;
    ly = y - 14;
  } else if (d <= 552.08) {
    const lenOnArc = d - 473.54;
    const angle = -PI / 2 - (lenOnArc / 25);
    x = 60 + 25 * Math.cos(angle);
    y = 99 + 25 * Math.sin(angle);
    ly = y + (y > 99 ? 18 : -18);
  } else {
    const lenOnLine = d - 552.08;
    x = 60 + lenOnLine;
    y = 124;
    ly = y + 19;
  }

  let tx = x;
  if (tx < 30) tx += 12;
  if (tx > 270) tx -= 12;

  // Make text easier to read by spacing a bit more
  if (ly === 24 + 19) ly = 24 + 18;

  return { cx: x, cy: y, tx, ly };
}

function MilestoneNode({
  index,
  sv,
  nextIdx,
  dotFillReached,
  dotFillPending,
  dotStrokePending,
  textColor
}: any) {
  const dotProps = useAnimatedProps(() => {
    const { cx, cy } = getPointAtDistance(sv.value);
    return { cx, cy };
  });

  const textProps = useAnimatedProps(() => {
    const { tx, ly } = getPointAtDistance(sv.value);
    // Explicit return casting to any avoids react-native-svg / reanimated typing conflicts for x, y arrays
    return { x: tx, y: ly } as any;
  });

  const reached = nextIdx === -1 || index < nextIdx;

  return (
    <G>
      <AnimatedCircle
        r={DOT_R}
        animatedProps={dotProps}
        fill={reached ? dotFillReached : dotFillPending}
        stroke={reached ? dotFillReached : dotStrokePending}
        strokeWidth={2.5}
      />
      <AnimatedText
        animatedProps={textProps}
        textAnchor="middle"
        fontSize={10}
        fontWeight="500"
        fill={textColor}
      >
        {MILESTONES[index].label}
      </AnimatedText>
    </G>
  );
}

export function JourneyBar({ minutesSinceQuit }: JourneyBarProps) {
  const colors = useThemeColors();

  const trackColor = colors.isDark ? 'rgba(160,150,220,0.25)' : '#ebe1d4';
  const dotFillReached = colors.textMuted;
  const dotFillPending = colors.isDark ? '#1a1745' : '#faf7f4';
  const dotStrokePending = colors.isDark ? 'rgba(160,150,220,0.3)' : '#d6cdc3';

  const nextIdx = MILESTONES.findIndex((m) => minutesSinceQuit < m.minutes);
  const layoutIdx = nextIdx === -1 ? 5 : nextIdx;
  const targetLayout = LAYOUTS[layoutIdx];

  const fillLength = useSharedValue(0);

  // Default to their target layout initially so they cleanly spring into exactly the right layout on mount
  const d0 = useSharedValue(targetLayout[0]);
  const d1 = useSharedValue(targetLayout[1]);
  const d2 = useSharedValue(targetLayout[2]);
  const d3 = useSharedValue(targetLayout[3]);
  const d4 = useSharedValue(targetLayout[4]);

  const dVars = [d0, d1, d2, d3, d4];

  useEffect(() => {
    // Glide dots
    dVars.forEach((d, i) => {
      // Small stagger on the initial lay down to make it elegant
      d.value = withDelay(
        2200 + i * 50,
        withTiming(targetLayout[i], { duration: 1500, easing: Easing.out(Easing.exp) })
      );
    });

    let newFillD = 0;
    if (nextIdx === -1) {
      newFillD = TOTAL_LENGTH;
    } else {
      const prevMin = nextIdx === 0 ? 0 : MILESTONES[nextIdx - 1].minutes;
      const nextMin = MILESTONES[nextIdx].minutes;
      const layoutPrevStart = nextIdx === 0 ? 0 : targetLayout[nextIdx - 1];

      const rawProgress = (minutesSinceQuit - prevMin) / (nextMin - prevMin);
      const p = Math.max(0, Math.min(1, rawProgress));

      newFillD = layoutPrevStart + p * (targetLayout[nextIdx] - layoutPrevStart);
    }

    // Sweep green progress line, delayed by 2200ms to allow the Recovery Ring (which takes ~2000ms) to finish first
    fillLength.value = withDelay(
      2200,
      withTiming(newFillD, { duration: 2500, easing: Easing.out(Easing.exp) })
    );

  }, [minutesSinceQuit, nextIdx]);

  const fillEndProps = useAnimatedProps(() => {
    return {
      strokeDasharray: `${TOTAL_LENGTH}`,
      strokeDashoffset: `${Math.max(0, TOTAL_LENGTH - fillLength.value)}`,
    };
  });

  return (
    <View className="mb-6">
      <Svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        style={{ width: '100%', aspectRatio: VB_W / VB_H }}
      >
        <Defs>
          <LinearGradient id="barGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#22c55e" />
            <Stop offset="1" stopColor="#34d8ac" />
          </LinearGradient>
        </Defs>

        {/* Track */}
        <Path
          d={CURVE_PATH}
          stroke={trackColor}
          strokeWidth={STROKE_W}
          fill="none"
          strokeLinecap="round"
        />

        {/* Dynamic Progress fill line */}
        <AnimatedPath
          d={CURVE_PATH}
          stroke="url(#barGrad)"
          strokeWidth={STROKE_W}
          fill="none"
          strokeLinecap="round"
          animatedProps={fillEndProps}
        />

        {/* Animated Milestone Nodes */}
        {MILESTONES.map((stone, i) => (
          <MilestoneNode
            key={stone.label}
            index={i}
            sv={dVars[i]}
            nextIdx={nextIdx}
            MILESTONES={MILESTONES}
            dotFillReached={dotFillReached}
            dotFillPending={dotFillPending}
            dotStrokePending={dotStrokePending}
            textColor={colors.textMuted}
          />
        ))}
      </Svg>
    </View>
  );
}
