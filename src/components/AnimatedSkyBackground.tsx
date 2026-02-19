import { useEffect, useRef, useMemo, useState } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSkyThemeStore } from '@/src/stores/skyThemeStore';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const STATIC_COLORS = { topColor: '#0a0a23', bottomColor: '#1a1050', starsOpacity: 1 };
const LIGHT_COLORS = { topColor: '#faf7f4', bottomColor: '#f5efe8', starsOpacity: 0 };

function getPhaseColors(hour: number): { topColor: string; bottomColor: string; starsOpacity: number } {
  const h = hour;

  if (h >= 21 || h < 5) {
    return { topColor: '#06040f', bottomColor: '#0f0d2e', starsOpacity: 1 };
  }
  if (h >= 5 && h < 6.5) {
    const t = (h - 5) / 1.5;
    return {
      topColor: lerpColor('#06040f', '#1a0f30', t),
      bottomColor: lerpColor('#0f0d2e', '#2d1640', t),
      starsOpacity: 1 - t * 0.7,
    };
  }
  if (h >= 6.5 && h < 8) {
    const t = (h - 6.5) / 1.5;
    return {
      topColor: lerpColor('#1a0f30', '#0c1530', t),
      bottomColor: lerpColor('#2d1640', '#16204a', t),
      starsOpacity: 0.3 * (1 - t),
    };
  }
  if (h >= 8 && h < 16) {
    return { topColor: '#0c1530', bottomColor: '#16204a', starsOpacity: 0 };
  }
  if (h >= 16 && h < 17.5) {
    const t = (h - 16) / 1.5;
    return {
      topColor: lerpColor('#0c1530', '#1a0a28', t),
      bottomColor: lerpColor('#16204a', '#251540', t),
      starsOpacity: t * 0.4,
    };
  }
  if (h >= 17.5 && h < 21) {
    const t = (h - 17.5) / 3.5;
    return {
      topColor: lerpColor('#1a0a28', '#06040f', t),
      bottomColor: lerpColor('#251540', '#0f0d2e', t),
      starsOpacity: 0.4 + t * 0.6,
    };
  }

  return STATIC_COLORS;
}

function lerpColor(a: string, b: string, t: number): string {
  const ar = parseInt(a.slice(1, 3), 16);
  const ag = parseInt(a.slice(3, 5), 16);
  const ab = parseInt(a.slice(5, 7), 16);
  const br = parseInt(b.slice(1, 3), 16);
  const bg = parseInt(b.slice(3, 5), 16);
  const bb = parseInt(b.slice(5, 7), 16);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`;
}

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  speed: number;
}

function generateStars(count: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * SCREEN_W,
      y: Math.random() * SCREEN_H,
      size: Math.random() * 2.5 + 0.5,
      baseOpacity: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 2000 + 2000,
    });
  }
  return stars;
}

function TwinklingStar({ star, phaseOpacity }: { star: Star; phaseOpacity: number }) {
  const anim = useRef(new Animated.Value(star.baseOpacity)).current;

  useEffect(() => {
    if (phaseOpacity === 0) return;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: Math.min(star.baseOpacity + 0.4, 1),
          duration: star.speed,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: star.baseOpacity * 0.3,
          duration: star.speed * 1.2,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [phaseOpacity > 0]);

  if (phaseOpacity === 0) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: star.x,
        top: star.y,
        width: star.size,
        height: star.size,
        borderRadius: star.size / 2,
        backgroundColor: '#ffffff',
        opacity: Animated.multiply(anim, phaseOpacity),
      }}
    />
  );
}

interface AnimatedSkyBackgroundProps {
  children: React.ReactNode;
}

export function AnimatedSkyBackground({ children }: AnimatedSkyBackgroundProps) {
  const theme = useSkyThemeStore((s) => s.theme);
  const stars = useMemo(() => generateStars(60), []);

  const getInitialColors = () => {
    if (theme === 'light') return LIGHT_COLORS;
    if (theme === 'dynamic') return getPhaseColors(new Date().getHours() + new Date().getMinutes() / 60);
    return STATIC_COLORS;
  };

  const [colors, setColors] = useState(getInitialColors);

  useEffect(() => {
    if (theme === 'light') {
      setColors(LIGHT_COLORS);
      return;
    }
    if (theme === 'static') {
      setColors(STATIC_COLORS);
      return;
    }
    // Dynamic: update immediately, then every minute
    const now = new Date();
    setColors(getPhaseColors(now.getHours() + now.getMinutes() / 60));
    const interval = setInterval(() => {
      const n = new Date();
      setColors(getPhaseColors(n.getHours() + n.getMinutes() / 60));
    }, 60_000);
    return () => clearInterval(interval);
  }, [theme]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={[colors.topColor, colors.bottomColor]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      {colors.starsOpacity > 0 && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {stars.map((star, i) => (
            <TwinklingStar key={i} star={star} phaseOpacity={colors.starsOpacity} />
          ))}
        </View>
      )}
      {children}
    </View>
  );
}
