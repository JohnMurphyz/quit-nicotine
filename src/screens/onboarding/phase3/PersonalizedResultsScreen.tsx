import { getCurrencySymbol } from '@/src/constants/currencies';
import type { OnboardingStackParamList } from '@/src/navigation/types';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const TRIGGER_OPTIONS: Record<string, { icon: string; label: string }> = {
    WakingUp: { icon: '☀️', label: 'Morning routine' },
    AfterMeals: { icon: '🍽️', label: 'After meals' },
    Stress: { icon: '😰', label: 'Stress' },
    Socializing: { icon: '🍻', label: 'Socializing' },
    Driving: { icon: '🚗', label: 'Driving' },
    Boredom: { icon: '😐', label: 'Boredom' },
    Coffee: { icon: '☕', label: 'Coffee breaks' },
    BeforeBed: { icon: '🌙', label: 'Before bed' },
};

const READINESS_TEXT: Record<number, string> = {
    4: "You're ready. Let's make this happen.",
    3: "Being nervous is normal. You've already taken the hardest step.",
    2: "Starting curious is enough. We'll build your confidence day by day.",
    1: "There's no pressure. Explore at your pace.",
};

function AnimatedCounter({ target, symbol }: { target: number; symbol: string }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let start: number | null = null;
        let frame: number;
        const duration = 1200;

        const step = (ts: number) => {
            if (!start) start = ts;
            const progress = ts - start;
            if (progress < duration) {
                const ease = 1 - Math.pow(2, -10 * progress / duration);
                setDisplay(Math.floor(ease * target));
                frame = requestAnimationFrame(step);
            } else {
                setDisplay(target);
            }
        };

        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [target]);

    return (
        <Text
            style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 28 }}
            className="text-emerald-400"
        >
            {symbol}{display.toLocaleString()}
        </Text>
    );
}

export default function PersonalizedResultsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { dailyCost, currency, triggers, readinessLevel } = useOnboardingStore();

    const symbol = getCurrencySymbol(currency);
    const daily = dailyCost && dailyCost > 0 ? dailyCost : 7;
    const monthlySavings = Math.round(daily * 30);
    const sixMonthSavings = Math.round(daily * 182);
    const yearlySavings = Math.round(daily * 365);

    return (
        <SafeAreaView className="flex-1 bg-dark-900">
            <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingTop: 40, paddingBottom: 32 }}>
                {/* Heading */}
                <Animated.View entering={FadeInUp.duration(500)}>
                    <Text
                        style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 32 }}
                        className="text-white mb-2"
                    >
                        Your snapshot
                    </Text>
                    <Text className="text-base text-white/50 mb-8 leading-relaxed">
                        Based on your answers, here's what quitting looks like for you.
                    </Text>
                </Animated.View>

                {/* Card 1 — Savings */}
                <Animated.View
                    entering={FadeInUp.duration(600).delay(0)}
                    className="bg-white/8 rounded-2xl p-6 border border-white/10 mb-4"
                >
                    <Text className="text-white/50 font-bold uppercase tracking-widest text-xs mb-5">
                        Money you'll save
                    </Text>
                    <View className="flex-row justify-between">
                        <View className="items-center flex-1">
                            <Text className="text-white/40 text-xs mb-2">30 days</Text>
                            <Text
                                style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 20 }}
                                className="text-white"
                            >
                                {symbol}{monthlySavings.toLocaleString()}
                            </Text>
                        </View>
                        <View className="items-center flex-1">
                            <Text className="text-white/40 text-xs mb-2">6 months</Text>
                            <Text
                                style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 20 }}
                                className="text-white"
                            >
                                {symbol}{sixMonthSavings.toLocaleString()}
                            </Text>
                        </View>
                        <View className="items-center flex-1">
                            <Text className="text-white/40 text-xs mb-2">1 year</Text>
                            <AnimatedCounter target={yearlySavings} symbol={symbol} />
                        </View>
                    </View>
                </Animated.View>

                {/* Card 2 — Health Timeline */}
                <Animated.View
                    entering={FadeInUp.duration(600).delay(200)}
                    className="bg-white/8 rounded-2xl p-6 border border-white/10 mb-4"
                >
                    <Text className="text-white/50 font-bold uppercase tracking-widest text-xs mb-5">
                        Health milestones
                    </Text>

                    <View className="flex-row items-start mb-4">
                        <View className="bg-emerald-500/20 rounded-full w-10 h-10 items-center justify-center mr-3 mt-0.5">
                            <Text className="text-emerald-400 font-bold text-xs">20m</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-bold mb-0.5">20 minutes</Text>
                            <Text className="text-white/50 text-sm">Heart rate and blood pressure begin to normalize</Text>
                        </View>
                    </View>

                    <View className="flex-row items-start mb-4">
                        <View className="bg-emerald-500/20 rounded-full w-10 h-10 items-center justify-center mr-3 mt-0.5">
                            <Text className="text-emerald-400 font-bold text-xs">72h</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-bold mb-0.5">72 hours</Text>
                            <Text className="text-white/50 text-sm">Nicotine fully leaves your body</Text>
                        </View>
                    </View>

                    <View className="flex-row items-start mb-3">
                        <View className="bg-emerald-500/20 rounded-full w-10 h-10 items-center justify-center mr-3 mt-0.5">
                            <Text className="text-emerald-400 font-bold text-xs">1yr</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-bold mb-0.5">1 year</Text>
                            <Text className="text-white/50 text-sm">Heart disease risk drops by 50%</Text>
                        </View>
                    </View>

                    <Text className="text-white/30 text-xs mt-1">Source: American Heart Association</Text>
                </Animated.View>

                {/* Card 3 — Triggers */}
                {triggers.length > 0 && (
                    <Animated.View
                        entering={FadeInUp.duration(600).delay(400)}
                        className="bg-white/8 rounded-2xl p-6 border border-white/10 mb-4"
                    >
                        <Text className="text-white/50 font-bold uppercase tracking-widest text-xs mb-4">
                            Your triggers
                        </Text>
                        <View className="flex-row flex-wrap gap-2 mb-4">
                            {triggers.map((id) => {
                                const trigger = TRIGGER_OPTIONS[id];
                                if (!trigger) return null;
                                return (
                                    <View
                                        key={id}
                                        className="bg-emerald-500/15 border border-emerald-500/30 rounded-full px-3 py-1.5 flex-row items-center"
                                    >
                                        <Text className="mr-1.5">{trigger.icon}</Text>
                                        <Text className="text-emerald-400 text-sm font-medium">{trigger.label}</Text>
                                    </View>
                                );
                            })}
                        </View>
                        <Text className="text-white/40 text-sm">
                            We'll send you craving SOS strategies for each of these.
                        </Text>
                    </Animated.View>
                )}

                {/* Readiness encouragement */}
                <Animated.View
                    entering={FadeInUp.duration(600).delay(600)}
                    className="items-center py-6"
                >
                    <Text className="text-white/60 text-center text-base leading-relaxed px-4">
                        {READINESS_TEXT[readinessLevel ?? 2]}
                    </Text>
                </Animated.View>
            </ScrollView>

            {/* CTA */}
            <View className="px-6 pb-8">
                <Animated.View entering={FadeInUp.duration(600).delay(800)}>
                    <Pressable
                        onPress={() => navigation.navigate('AuthCreation')}
                        className="w-full bg-white h-14 rounded-2xl items-center justify-center shadow-lg active:opacity-80"
                    >
                        <Text className="text-black text-lg font-bold">Create my account</Text>
                    </Pressable>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}
