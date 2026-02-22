import { useSkyThemeStore } from '@/src/stores/skyThemeStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/* ─── colour palettes ─── */
const STATIC_COLORS = { topColor: '#0a0a23', bottomColor: '#1a1050', starsOpacity: 1 };
const LIGHT_COLORS = { topColor: '#faf7f4', bottomColor: '#f5efe8', starsOpacity: 0 };


/* ─── star data ─── */
interface StarData {
  x: number; y: number;
  size: number;
  /** peak opacity 0-1 */
  peak: number;
  /** trough opacity 0-1 */
  trough: number;
  /** cycle ms */
  dur: number;
  /** initial delay ms */
  delay: number;
  /** warm / cool tint */
  tint: string;
}

function makeStars(n: number): StarData[] {
  const out: StarData[] = [];
  for (let i = 0; i < n; i++) {
    // Most stars are tiny dust; a few are brighter points
    const isBright = Math.random() < 0.12;
    const size = isBright ? 1.8 + Math.random() * 1.2 : 0.6 + Math.random() * 1.2;
    const peak = isBright ? 0.7 + Math.random() * 0.3 : 0.25 + Math.random() * 0.35;
    // Some stars barely twinkle, some vary a lot → organic feel
    const twinkleDepth = 0.3 + Math.random() * 0.5;       // 0.3..0.8 of peak
    const trough = peak * (1 - twinkleDepth);
    // Slow random cycles → not in-sync
    const dur = 3000 + Math.random() * 6000;               // 3s – 9s
    const delay = Math.random() * 800;                       // appear within first 0.8s
    // Subtle colour: mostly white, rare star has slight blue or amber
    const roll = Math.random();
    const tint = roll < 0.06 ? '#cce0ff'                   // blue-ish
      : roll < 0.10 ? '#fff4d6'                   // amber-ish
        : '#ffffff';
    out.push({ x: Math.random() * SCREEN_W, y: Math.random() * SCREEN_H, size, peak, trough, dur, delay, tint });
  }
  return out;
}

/* ─── individual star ─── */
function Star({ d, vis }: { d: StarData; vis: number }) {
  const o = useSharedValue(d.trough);

  useEffect(() => {
    if (vis === 0) return;
    o.value = withDelay(
      d.delay,
      withRepeat(
        withSequence(
          withTiming(d.peak, { duration: d.dur, easing: Easing.inOut(Easing.sin) }),
          withTiming(d.trough, { duration: d.dur * 1.1, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
      ),
    );
    return () => { o.value = d.trough; };
  }, [vis > 0]);

  const style = useAnimatedStyle(() => ({ opacity: o.value * vis }));

  if (vis === 0) return null;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: d.x,
          top: d.y,
          width: d.size,
          height: d.size,
          borderRadius: d.size,
          backgroundColor: d.tint,
        },
        style,
      ]}
    />
  );
}

/* ─── shooting star ─── */
function ShootingStar({ starsVisible }: { starsVisible: number }) {
  const progress = useSharedValue(0);  // 0→1 drives position + fade
  const [trail, setTrail] = useState<{
    x: number; y: number; angle: number; len: number; dist: number;
  } | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fire = () => {
    const x = Math.random() * SCREEN_W;
    const y = Math.random() * SCREEN_H * 0.65;
    const angle = 15 + Math.random() * 50;
    const len = 100 + Math.random() * 140;
    const dist = 200 + Math.random() * 200; // how far it travels

    setTrail({ x, y, angle, len, dist });

    // Animate: streak across the sky
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 800 + Math.random() * 400, // 0.8–1.2s streak
      easing: Easing.out(Easing.quad),
    });

    // Schedule next one
    const next = 6000 + Math.random() * 18000; // 6–24s
    timerRef.current = setTimeout(fire, next);
  };

  useEffect(() => {
    if (starsVisible === 0) return;
    const initial = 2000 + Math.random() * 8000;
    timerRef.current = setTimeout(fire, initial);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [starsVisible > 0]);

  const animStyle = useAnimatedStyle(() => {
    if (!trail) return { opacity: 0 };

    const rad = (trail.angle * Math.PI) / 180;
    const tx = Math.cos(rad) * progress.value * trail.dist;
    const ty = Math.sin(rad) * progress.value * trail.dist;

    // Fade in fast at start, hold, fade out at end
    const op = interpolate(
      progress.value,
      [0, 0.05, 0.5, 0.85, 1],
      [0, 0.9, 0.8, 0.3, 0],
    );

    return {
      opacity: op * starsVisible,
      transform: [
        { translateX: tx },
        { translateY: ty },
        { rotate: `${trail.angle}deg` },
      ],
    };
  });

  if (starsVisible === 0 || !trail) return null;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: trail.x,
          top: trail.y,
          width: trail.len,
          height: 1.5,
        },
        animStyle,
      ]}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', '#ffffff']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{ flex: 1, borderRadius: 1 }}
      />
    </Animated.View>
  );
}

/* ─── nebula glow — soft ambient patches ─── */
function NebulaGlow({ starsVisible }: { starsVisible: number }) {
  const o = useSharedValue(0.3);

  useEffect(() => {
    if (starsVisible === 0) return;
    o.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 12000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.25, { duration: 14000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
  }, [starsVisible > 0]);

  const style = useAnimatedStyle(() => ({ opacity: o.value * starsVisible }));

  if (starsVisible === 0) return null;

  return (
    <>
      {/* Upper-left warm glow */}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            left: -SCREEN_W * 0.3,
            top: SCREEN_H * 0.05,
            width: SCREEN_W * 0.9,
            height: SCREEN_W * 0.9,
            borderRadius: SCREEN_W * 0.45,
            backgroundColor: 'rgba(90, 40, 120, 0.08)',
          },
          style,
        ]}
      />
      {/* Lower-right cool glow */}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            right: -SCREEN_W * 0.35,
            bottom: SCREEN_H * 0.15,
            width: SCREEN_W * 0.85,
            height: SCREEN_W * 0.85,
            borderRadius: SCREEN_W * 0.43,
            backgroundColor: 'rgba(30, 50, 120, 0.06)',
          },
          style,
        ]}
      />
    </>
  );
}

/* ─── main component ─── */
interface Props { children: React.ReactNode }

export function AnimatedSkyBackground({ children }: Props) {
  const theme = useSkyThemeStore(s => s.theme);
  const stars = useMemo(() => makeStars(80), []);

  const resolve = (): { topColor: string; bottomColor: string; starsOpacity: number } => {
    if (theme === 'light') return LIGHT_COLORS;
    return STATIC_COLORS;
  };

  const [prev, setPrev] = useState(resolve);
  const [curr, setCurr] = useState(resolve);
  const fade = useSharedValue(1);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

  useEffect(() => {
    const tick = () => {
      const next = resolve();
      setCurr(c => {
        if (next.topColor === c.topColor && next.bottomColor === c.bottomColor) return c;
        setPrev(c);
        fade.value = 0;
        fade.value = withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) });
        return next;
      });
    };
    tick();
  }, [theme]);

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* back layer */}
      <LinearGradient colors={[prev.topColor, prev.bottomColor]} style={StyleSheet.absoluteFill} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} />
      {/* crossfade layer */}
      <Animated.View style={[StyleSheet.absoluteFill, fadeStyle]}>
        <LinearGradient colors={[curr.topColor, curr.bottomColor]} style={StyleSheet.absoluteFill} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} />
      </Animated.View>

      {curr.starsOpacity > 0 && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Nebula ambient */}
          <NebulaGlow starsVisible={curr.starsOpacity} />
          {/* Stars */}
          {stars.map((s, i) => <Star key={i} d={s} vis={curr.starsOpacity} />)}
          {/* Shooting stars — 2 staggered instances */}
          <ShootingStar starsVisible={curr.starsOpacity} />
          <ShootingStar starsVisible={curr.starsOpacity} />
        </View>
      )}

      {children}
    </View>
  );
}
