import CoastalMiddaySvg from '@/assets/images/scene-coastal-midday.svg';
import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { BreathingExercise } from '@/src/components/BreathingExercise';
import { RecoveryRing } from '@/src/components/RecoveryRing';
import type { OnboardingStackParamList } from '@/src/navigation/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    FadeIn,
    FadeOut,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* ─── Background (unchanged) ─── */
function Background() {
    return (
        <View style={StyleSheet.absoluteFill} className="bg-black">
            <View style={StyleSheet.absoluteFill}>
                <CoastalMiddaySvg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
            </View>
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.85)']}
                locations={[0.2, 0.5, 1]}
                style={StyleSheet.absoluteFill}
            />
        </View>
    );
}

/* ─── Walkthrough Pager Dots ─── */
// We removed the overall walkthrough dots since they clutter the UI 
// when combined with the specific feature slide dots.

/* ─── Feature Slide Dots ─── */
function SlideDots({ count, active }: { count: number; active: number }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {Array.from({ length: count }).map((_, i) => (
                <View
                    key={i}
                    style={{
                        width: i === active ? 24 : 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: i === active ? '#fff' : 'rgba(255,255,255,0.3)',
                    }}
                />
            ))}
        </View>
    );
}

/* ════════════════════════════════════════
   DEMO CARDS — Lightweight mock components
   ════════════════════════════════════════ */

/* ─── 0. Intro Slide (Floating Cards) ─── */
function DemoIntro() {
    return (
        <View style={{ height: 320, width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
            {/* Card 1: Pledge (Top Left) */}
            <Animated.View
                entering={FadeIn.duration(1000).delay(300)}
                style={{
                    position: 'absolute',
                    top: 10,
                    left: 0,
                    transform: [{ rotate: '-8deg' }],
                    zIndex: 2,
                }}
            >
                <BlurView intensity={20} tint="light" style={{ width: 150, borderRadius: 24, padding: 16, backgroundColor: 'transparent', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' }}>
                    <Text style={{ fontSize: 32, fontWeight: '800', color: '#fff', letterSpacing: -1 }}>14</Text>
                    <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: '600', marginTop: -2, marginBottom: 12 }}>days nicotine-free</Text>

                    <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
                        <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(16,185,129,0.12)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.5)', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#10b981', fontSize: 10, fontWeight: '700' }}>✓</Text>
                        </View>
                        <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(16,185,129,0.12)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.5)', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#10b981', fontSize: 10, fontWeight: '700' }}>✓</Text>
                        </View>
                        <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '700' }}>–</Text>
                        </View>
                    </View>

                    <View style={{ backgroundColor: 'rgba(255,255,255,0.12)', paddingVertical: 8, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
                        <Ionicons name="shield-checkmark" size={12} color="rgba(255,255,255,0.7)" />
                        <Text style={{ fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.7)' }}>Pledge Today</Text>
                    </View>
                </BlurView>
            </Animated.View>

            {/* Card 2: Recovery Ring (Right) */}
            <Animated.View
                entering={FadeIn.duration(1000).delay(500)}
                style={{
                    position: 'absolute',
                    top: 50,
                    right: -10,
                    transform: [{ rotate: '6deg' }],
                    zIndex: 1,
                }}
            >
                <BlurView intensity={20} tint="light" style={{ width: 160, borderRadius: 24, padding: 16, backgroundColor: 'transparent', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 14 }}>❤️</Text></View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff', marginBottom: 4 }}>Heart rate normalizes</Text>
                            <View style={{ height: 4, borderRadius: 2, backgroundColor: '#10b981' }} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 14 }}>👃</Text></View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff', marginBottom: 4 }}>Taste & smell return</Text>
                            <View style={{ height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                <View style={{ width: '75%', height: 4, borderRadius: 2, backgroundColor: '#a78bfa' }} />
                            </View>
                        </View>
                    </View>
                </BlurView>
            </Animated.View>

            {/* Card 3: Partner / SOS (Bottom Center) */}
            <Animated.View
                entering={FadeIn.duration(1000).delay(700)}
                style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 20,
                    right: 20,
                    transform: [{ rotate: '-3deg' }],
                    zIndex: 3,
                }}
            >
                <BlurView intensity={20} tint="light" style={{ borderRadius: 24, padding: 16, backgroundColor: 'transparent', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(244,63,94,0.15)', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#fb7185' }}>S</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>Sarah</Text>
                            <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Watching your progress</Text>
                        </View>
                        <View style={{ backgroundColor: 'rgba(52,211,153,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                            <Text style={{ fontSize: 9, fontWeight: '800', color: '#34d399', textTransform: 'uppercase' }}>ACTIVE</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="leaf" size={10} color="rgba(255,255,255,0.8)" />
                            </View>
                            <Text style={{ fontSize: 11, color: '#fff', fontWeight: '600' }}>Pledges</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="star" size={10} color="rgba(255,255,255,0.8)" />
                            </View>
                            <Text style={{ fontSize: 11, color: '#fff', fontWeight: '600' }}>Goals</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="pulse" size={10} color="rgba(255,255,255,0.8)" />
                            </View>
                            <Text style={{ fontSize: 11, color: '#fff', fontWeight: '600' }}>Stats</Text>
                        </View>
                    </View>
                </BlurView>
            </Animated.View>
        </View>
    );
}


/* ─── 1. Track Your Sobriety ─── */
function DemoSobriety() {
    const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const STATUS = ['✓', '✓', '✓', '✓', '✓', '✕', '–'];

    return (
        <View style={{ alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 }}>
            {/* Large streak counter */}
            <Text style={{ fontSize: 56, fontWeight: '800', color: '#fff', letterSpacing: -2 }}>
                14
            </Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: '600', marginTop: -4, marginBottom: 16 }}>
                days nicotine-free
            </Text>

            {/* Week row */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 16 }}>
                {DAYS.map((letter, i) => {
                    const isCheck = STATUS[i] === '✓';
                    const isMiss = STATUS[i] === '✕';
                    return (
                        <View key={i} style={{ alignItems: 'center', gap: 4 }}>
                            <View
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 18,
                                    borderWidth: 2,
                                    borderColor: isCheck
                                        ? 'rgba(16,185,129,0.5)'
                                        : isMiss
                                            ? 'rgba(239,68,68,0.3)'
                                            : 'rgba(255,255,255,0.15)',
                                    backgroundColor: isCheck
                                        ? 'rgba(16,185,129,0.12)'
                                        : 'transparent',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text style={{
                                    color: isCheck ? '#10b981' : isMiss ? '#ef4444' : 'rgba(255,255,255,0.3)',
                                    fontSize: 14,
                                    fontWeight: '700',
                                }}>
                                    {STATUS[i]}
                                </Text>
                            </View>
                            <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>
                                {letter}
                            </Text>
                        </View>
                    );
                })}
            </View>

            {/* Pledge button */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 20,
                    gap: 6,
                }}
            >
                <Ionicons name="shield-checkmark" size={16} color="rgba(255,255,255,0.7)" />
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '700', fontSize: 14 }}>
                    Pledge Today
                </Text>
            </View>
        </View>
    );
}

/* ─── 2. Watch Your Recovery ─── */
function AnimatedMilestoneRow({ m, index }: { m: any, index: number }) {
    const progressWidth = useSharedValue(0);

    useEffect(() => {
        progressWidth.value = withDelay(
            600 + (index * 200),
            withTiming(m.progress, { duration: 1000, easing: Easing.out(Easing.cubic) })
        );
    }, [m.progress, index]);

    const barStyle = useAnimatedStyle(() => ({
        width: `${progressWidth.value * 100}%`,
    }));

    return (
        <Animated.View entering={FadeIn.delay(400 + index * 100).duration(400)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 }}>
            <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(255,255,255,0.08)',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Text style={{ fontSize: 18 }}>{m.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 4 }}>
                    {m.title}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <Animated.View style={[{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: m.progress >= 1 ? '#10b981' : '#a78bfa',
                        }, barStyle]} />
                    </View>
                    <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: '500', minWidth: 40, textAlign: 'right' }}>
                        {m.progress >= 1 ? '✓' : m.time}
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
}

function DemoRecovery() {
    const MILESTONES = [
        { icon: '❤️', title: 'Heart rate normalizes', progress: 1.0, time: '20m' },
        { icon: '👃', title: 'Taste & smell return', progress: 0.75, time: '48h' },
        { icon: '🫁', title: 'Lung function improves', progress: 0.4, time: '3mo' },
    ];

    return (
        <View style={{ alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 }}>
            {/* The Recovery Ring */}
            <View style={{ transform: [{ scale: 0.8 }], marginTop: -32, marginBottom: -36 }}>
                <RecoveryRing percentage={65} daysFree={14} nextMilestoneLabel="LUNG FUNCTION" />
            </View>

            {/* The Animated List */}
            <View style={{ width: '100%' }}>
                {MILESTONES.map((m, i) => (
                    <AnimatedMilestoneRow key={i} m={m} index={i} />
                ))}
            </View>
        </View>
    );
}

/* ─── 3. Accountability Partner ─── */
function DemoPartner() {
    const PERMS = [
        { icon: 'leaf' as const, label: 'Daily Pledges', on: true },
        { icon: 'star' as const, label: 'Quit Goals', on: true },
        { icon: 'pulse' as const, label: 'Symptoms', on: true },
    ];

    return (
        <View style={{ paddingVertical: 16, paddingHorizontal: 20 }}>
            {/* Partner header */}
            <Animated.View entering={FadeIn.delay(300).duration(600)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <View style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: 'rgba(244,63,94,0.15)', // Rose / Coral base
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16,
                    borderWidth: 1,
                    borderColor: 'rgba(244,63,94,0.3)',
                }}>
                    <Text style={{ fontSize: 22, fontWeight: '800', color: '#fb7185' }}>S</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: 0.3, marginBottom: 2 }}>
                        Sarah
                    </Text>
                    <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>
                        Watching your progress
                    </Text>
                </View>
                <View style={{
                    backgroundColor: 'rgba(52,211,153,0.15)', // Emerald
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(52,211,153,0.3)',
                }}>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#34d399', textTransform: 'uppercase', letterSpacing: 0.5 }}>ACTIVE</Text>
                </View>
            </Animated.View>

            {/* Permission indicators */}
            <View style={{ gap: 12 }}>
                {PERMS.map((p, i) => (
                    <Animated.View key={i} entering={FadeIn.delay(600 + (i * 150)).duration(400)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Ionicons name={p.icon} size={16} color="rgba(255,255,255,0.8)" />
                        </View>
                        <Text style={{ fontSize: 15, color: '#fff', fontWeight: '600', flex: 1, letterSpacing: 0.2 }}>
                            {p.label}
                        </Text>
                        <Ionicons name="checkmark-circle" size={20} color="#34d399" />
                    </Animated.View>
                ))}
            </View>
        </View>
    );
}

/* ─── 4. Craving SOS ─── */
function DemoSOS() {
    const [timeLeft, setTimeLeft] = useState(154); // 2:34

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    return (
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            {/* Timer Headline */}
            <Text style={{ fontSize: 56, fontWeight: '800', color: '#fff', letterSpacing: -1, marginBottom: 4, fontFamily: 'AbrilFatface_400Regular' }}>
                {timeString}
            </Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 24, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1 }}>
                Breathe through it
            </Text>

            {/* Breathing exercise */}
            <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 20, height: 160 }}>
                <View style={{ transform: [{ scale: 0.45 }], marginTop: -60 }}>
                    <BreathingExercise />
                </View>
            </View>

            {/* Success button */}
            <View
                style={{
                    paddingVertical: 12,
                    paddingHorizontal: 28,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: 'rgba(52,211,153,0.3)', // Emerald border
                    backgroundColor: 'rgba(52,211,153,0.15)', // Emerald fill
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                }}
            >
                <Ionicons name="checkmark-circle" size={18} color="#34d399" />
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: 0.2 }}>
                    I made it through
                </Text>
            </View>
        </View>
    );
}

/* ════════════════════════════════
   SLIDE DATA
   ════════════════════════════════ */
const SLIDES = [
    {
        headline: 'Your Toolkit',
        subtitle: 'Everything you need to break free from nicotine, built into one seamless experience.',
        Demo: DemoIntro,
    },
    {
        headline: 'Track Your Sobriety',
        subtitle: 'Daily pledges and streak tracking keep you committed and motivated.',
        Demo: DemoSobriety,
    },
    {
        headline: 'Watch Your Recovery',
        subtitle: 'See your body heal in real-time with science-backed health milestones.',
        Demo: DemoRecovery,
    },
    {
        headline: 'Accountability Partner',
        subtitle: 'Invite someone you trust to follow your journey and keep you honest.',
        Demo: DemoPartner,
    },
    {
        headline: 'Craving SOS',
        subtitle: 'Guided breathing and grounding tools when you need help the most.',
        Demo: DemoSOS,
    },
];

/* ════════════════════════════════
   MAIN SCREEN
   ════════════════════════════════ */
export default function WalkthroughFeaturesScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const insets = useSafeAreaInsets();
    const [slideIndex, setSlideIndex] = useState(0);

    const isLast = slideIndex === SLIDES.length - 1;
    const slide = SLIDES[slideIndex];
    const Demo = slide.Demo;

    const handleNext = useCallback(() => {
        if (isLast) {
            navigation.navigate('QuizNicotineType');
        } else {
            setSlideIndex((i) => i + 1);
        }
    }, [isLast, navigation]);

    const bgOpacity = useSharedValue(1); // 1 = Coastal, 0 = Starry Night

    useEffect(() => {
        // Slide 0 (Intro) shows coastal. Slides 1+ show Starry Night.
        bgOpacity.value = withTiming(slideIndex === 0 ? 1 : 0, {
            duration: 800,
            easing: Easing.inOut(Easing.ease),
        });
    }, [slideIndex]);

    const coastalStyle = useAnimatedStyle(() => ({
        opacity: bgOpacity.value,
        ...StyleSheet.absoluteFillObject,
        zIndex: 2,
    }));

    const starryStyle = useAnimatedStyle(() => ({
        opacity: 1 - bgOpacity.value,
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    }));

    return (
        <View className="flex-1 bg-black">
            {/* Dark Starry Background (Fades in) */}
            <Animated.View style={starryStyle}>
                <AnimatedSkyBackground>
                    <View style={StyleSheet.absoluteFill} />
                </AnimatedSkyBackground>
            </Animated.View>

            {/* Coastal Background (Fades out) */}
            <Animated.View style={coastalStyle} pointerEvents="none">
                <Background />
            </Animated.View>

            {/* Floating brand mark */}
            <View style={{ paddingTop: insets.top + 12 }} className="absolute top-0 w-full flex-row justify-center items-center z-10 pointer-events-none">
                <Text style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 20, letterSpacing: 2, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 8 }} className="text-white/80">
                    FREED
                </Text>
            </View>

            <View className="flex-1 justify-end px-6 z-10" style={{ paddingBottom: insets.bottom + 16 }}>

                {/* Demo card */}
                {slideIndex === 0 ? (
                    <Animated.View key="demo-0" entering={FadeIn.duration(400).delay(200)} exiting={FadeOut.duration(200)}>
                        <Demo />
                    </Animated.View>
                ) : (
                    <Animated.View key={`demo - ${slideIndex} `} entering={FadeIn.duration(400).delay(200)} exiting={FadeOut.duration(200)}>
                        <BlurView
                            intensity={20}
                            tint="light"
                            style={{ borderRadius: 24, overflow: 'hidden', backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' }}
                        >
                            <Demo />
                        </BlurView>
                    </Animated.View>
                )}

                {/* Headline + subtitle */}
                <Animated.View key={`text - ${slideIndex} `} entering={FadeIn.duration(400).delay(slideIndex === 0 ? 0 : 300)} style={{ alignItems: 'center', marginTop: slideIndex === 0 ? 0 : 32, marginBottom: 40 }}>
                    <Text
                        style={{
                            fontSize: 32,
                            fontFamily: 'AbrilFatface_400Regular',
                            letterSpacing: 0.5,
                            color: '#fff',
                            textAlign: 'center',
                            marginBottom: 12,
                            textShadowColor: 'rgba(0,0,0,0.6)',
                            textShadowOffset: { width: 0, height: 2 },
                            textShadowRadius: 12,
                        }}
                    >
                        {slide.headline}
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: 'rgba(255,255,255,0.7)',
                            textAlign: 'center',
                            lineHeight: 24,
                            paddingHorizontal: 16,
                        }}
                    >
                        {slide.subtitle}
                    </Text>
                </Animated.View>

                {/* Unified Bottom Controls Row */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, height: 56 }}>

                    {/* Dots on the left */}
                    <SlideDots count={SLIDES.length} active={slideIndex} />

                    {/* Next/Finish Button on the right */}
                    <Pressable
                        onPress={handleNext}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderRadius: 28,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 8,
                            elevation: 5,
                        }}
                    >
                        <Text style={{ color: '#000', fontSize: 15, fontWeight: '800', marginRight: 4 }}>
                            {isLast ? "Let's Begin" : "Next"}
                        </Text>
                        <Ionicons name="arrow-forward" size={18} color="#000" />
                    </Pressable>
                </View>

            </View>
        </View>
    );
}
