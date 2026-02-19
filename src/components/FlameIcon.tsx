import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface FlameIconProps {
  size?: number;
  active?: boolean;
}

export function FlameIcon({ size = 26, active = false }: FlameIconProps) {
  const inactive = '#8580a8';

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="flame-grad" x1="0.5" y1="1" x2="0.5" y2="0">
          <Stop offset="0" stopColor="#f97316" />
          <Stop offset="1" stopColor="#fbbf24" />
        </LinearGradient>
      </Defs>
      <Path
        d="M12 2C10.5 6.5 6 8.5 6 13a6 6 0 0 0 12 0c0-4.5-4.5-6.5-6-11Z"
        stroke={active ? 'url(#flame-grad)' : inactive}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M12 19c-1.7 0-3-1.3-3-3 0-2 1.5-2.8 3-5 1.5 2.2 3 3 3 5 0 1.7-1.3 3-3 3Z"
        fill={active ? 'url(#flame-grad)' : inactive}
      />
    </Svg>
  );
}
