import { View, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useThemeColors } from '@/src/hooks/useThemeColors';

interface RecoveryRingProps {
  percentage: number; // 0–100
  daysFree: number;
  nextMilestoneLabel?: string;
}

const SIZE = 240;
const PROGRESS_STROKE = 18;
const TRACK_STROKE = 2;
const RADIUS = (SIZE - PROGRESS_STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function RecoveryRing({ percentage, daysFree, nextMilestoneLabel }: RecoveryRingProps) {
  const clamped = Math.min(100, Math.max(0, percentage));
  const offset = CIRCUMFERENCE * (1 - clamped / 100);
  const colors = useThemeColors();

  return (
    <View className="items-center py-6">
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <Defs>
            <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#22c55e" />
              <Stop offset="1" stopColor="#34d8ac" />
            </LinearGradient>
          </Defs>
          {/* Thin track */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={colors.borderColor}
            strokeWidth={TRACK_STROKE}
            fill="none"
          />
          {/* Thick progress arc */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="url(#ringGrad)"
            strokeWidth={PROGRESS_STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            rotation={-90}
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>

        {/* Center text overlay */}
        <View
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          className="items-center justify-center"
        >
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textMuted, letterSpacing: 2 }}>
            RECOVERY
          </Text>
          <Text style={{ fontSize: 48, fontWeight: '700', color: colors.textPrimary }}>
            {Math.round(clamped)}%
          </Text>
          <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textSecondary }}>
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
