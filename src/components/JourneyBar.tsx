import { View } from 'react-native';
import Svg, {
  Path,
  Circle,
  G,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { useThemeColors } from '@/src/hooks/useThemeColors';

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

// ── S-curve geometry ──────────────────────────────────────────────
const VB_W = 300;
const VB_H = 150;
const CURVE_PATH =
  'M 25 24 L 240 24 A 25 25 0 0 1 240 74 L 60 74 A 25 25 0 0 0 60 124 L 285 124';

const TOTAL_LENGTH = 777;
const STROKE_W = 5;
const DOT_R = 8;

const DOTS: {
  x: number;
  y: number;
  d: number;
  ly: number;
  anchor: 'start' | 'middle' | 'end';
}[] = [
  { x: 80, y: 24, d: 55, ly: 43, anchor: 'middle' },
  { x: 240, y: 24, d: 215, ly: 14, anchor: 'middle' },
  { x: 60, y: 74, d: 473, ly: 63, anchor: 'middle' },
  { x: 150, y: 124, d: 642, ly: 143, anchor: 'middle' },
  { x: 245, y: 124, d: 737, ly: 143, anchor: 'middle' },
];

function computeFillLength(minutesSinceQuit: number): number {
  const nextIdx = MILESTONES.findIndex((m) => minutesSinceQuit < m.minutes);

  if (nextIdx === -1) return TOTAL_LENGTH;

  const prevDist = nextIdx === 0 ? 0 : DOTS[nextIdx - 1].d;
  const nextDist = DOTS[nextIdx].d;
  const prevMin = nextIdx === 0 ? 0 : MILESTONES[nextIdx - 1].minutes;
  const nextMin = MILESTONES[nextIdx].minutes;
  const progress = (minutesSinceQuit - prevMin) / (nextMin - prevMin);

  return prevDist + progress * (nextDist - prevDist);
}

export function JourneyBar({ minutesSinceQuit }: JourneyBarProps) {
  const fillLength = computeFillLength(minutesSinceQuit);
  const colors = useThemeColors();

  const trackColor = colors.isDark ? 'rgba(160,150,220,0.25)' : '#ebe1d4';
  const dotFillReached = colors.textMuted;
  const dotFillPending = colors.isDark ? '#1a1745' : '#faf7f4';
  const dotStrokePending = colors.isDark ? 'rgba(160,150,220,0.3)' : '#d6cdc3';

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

        {/* Progress fill */}
        <Path
          d={CURVE_PATH}
          stroke="url(#barGrad)"
          strokeWidth={STROKE_W}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${TOTAL_LENGTH}`}
          strokeDashoffset={`${TOTAL_LENGTH - fillLength}`}
        />

        {/* Milestone dots + labels */}
        {DOTS.map((dot, i) => {
          const reached = minutesSinceQuit >= MILESTONES[i].minutes;
          return (
            <G key={MILESTONES[i].label}>
              <Circle
                cx={dot.x}
                cy={dot.y}
                r={DOT_R}
                fill={reached ? dotFillReached : dotFillPending}
                stroke={reached ? dotFillReached : dotStrokePending}
                strokeWidth={2.5}
              />
              <SvgText
                x={dot.x}
                y={dot.ly}
                textAnchor={dot.anchor}
                fontSize={10}
                fontWeight="500"
                fill={colors.textMuted}
              >
                {MILESTONES[i].label}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
