import type { OnboardingStackParamList } from '@/src/navigation/types';
import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const CURRENCY_SYMBOLS: Record<string, string> = {
    USD: '$', GBP: '£', EUR: '€', CAD: 'CA$', AUD: 'A$',
};

const MOTIVATION_MAP: Record<string, { icon: string; label: string }> = {
    Health: { icon: '❤️', label: 'My health' },
    Money: { icon: '💰', label: 'Save money' },
    Family: { icon: '👨‍👩‍👧', label: 'My family' },
    Freedom: { icon: '🦅', label: 'Freedom' },
    Fitness: { icon: '🏃', label: 'Fitness' },
    MentalClarity: { icon: '🧠', label: 'Mental clarity' },
};

export default function PaywallInsightsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { dailyCost, currency, nicotineType, motivations } = useOnboardingStore();

    const sym = CURRENCY_SYMBOLS[currency] ?? '$';
    const annualCost = dailyCost ? Math.round(dailyCost * 365) : null;
    const substance = nicotineType ?? 'nicotine';

    return (
        <AnimatedSkyBackground><View className="flex-1">
            <SafeAreaView className="flex-1 px-6 pt-4" edges={['top']}>
                {/* Back button */}
                <Animated.View entering={FadeInUp.duration(600).delay(0)}>
                    <Pressable
                        onPress={() => navigation.goBack()}
                        className="w-12 h-12 items-center justify-center active:opacity-60"
                    >
                        <Ionicons name="arrow-back" size={24} color="rgba(255,255,255,0.7)" />
                    </Pressable>
                </Animated.View>

                {/* Headline */}
                <Animated.View entering={FadeInUp.duration(600).delay(100)} className="mt-5 mb-6">
                    <Text
                        style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 28 }}
                        className="text-white"
                    >
                        {"Here's what quitting\ngives you back"}
                    </Text>
                </Animated.View>

                {/* Money card — stat style */}
                <Animated.View entering={FadeInUp.duration(600).delay(200)}>
                    <View className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-5 mb-3">
                        <View className="flex-row items-start justify-between mb-3">
                            <Text
                                style={{ color: 'rgba(251,191,36,0.55)', fontSize: 11 }}
                                className="font-bold tracking-widest uppercase"
                            >
                                {annualCost ? `Annual spend on ${substance}` : "Money you'll save"}
                            </Text>
                            <View className="w-7 h-7 rounded-full bg-amber-500/20 items-center justify-center">
                                <Ionicons name="cash-outline" size={14} color="#fbbf24" />
                            </View>
                        </View>
                        {annualCost ? (
                            <>
                                <Text style={{ fontSize: 42, fontWeight: '800', color: 'white', lineHeight: 46 }}>
                                    {sym}{annualCost.toLocaleString()}
                                </Text>
                                <Text className="text-white/40 text-sm mt-1">
                                    going to {substance} every year — yours to keep
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text style={{ fontSize: 38, fontWeight: '800', color: 'white', lineHeight: 42 }}>
                                    Thousands
                                </Text>
                                <Text className="text-white/40 text-sm mt-1">
                                    saved every year. Every day you quit is money back.
                                </Text>
                            </>
                        )}
                    </View>
                </Animated.View>

                {/* Health card — stat style */}
                <Animated.View entering={FadeInUp.duration(600).delay(280)}>
                    <View className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-5 mb-5">
                        <View className="flex-row items-start justify-between mb-3">
                            <Text
                                style={{ color: 'rgba(52,211,153,0.55)', fontSize: 11 }}
                                className="font-bold tracking-widest uppercase"
                            >
                                After 12 months nicotine-free
                            </Text>
                            <View className="w-7 h-7 rounded-full bg-emerald-500/20 items-center justify-center">
                                <Ionicons name="pulse-outline" size={14} color="#34d399" />
                            </View>
                        </View>
                        <Text style={{ fontSize: 42, fontWeight: '800', color: '#34d399', lineHeight: 46 }}>
                            50% ↓
                        </Text>
                        <Text className="text-white/40 text-sm mt-1">
                            heart disease risk. Your body starts healing from day one.
                        </Text>
                    </View>
                </Animated.View>

                {/* Motivations */}
                {motivations.length > 0 && (
                    <Animated.View entering={FadeInUp.duration(600).delay(360)}>
                        <Text
                            style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}
                            className="font-bold tracking-widest uppercase mb-3"
                        >
                            You're doing this for
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                            {motivations.slice(0, 5).map((id) => {
                                const m = MOTIVATION_MAP[id];
                                if (!m) return null;
                                return (
                                    <View
                                        key={id}
                                        className="flex-row items-center gap-1.5 rounded-full px-3 py-1.5"
                                        style={{ backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}
                                    >
                                        <Text style={{ fontSize: 14 }}>{m.icon}</Text>
                                        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: '500' }}>
                                            {m.label}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    </Animated.View>
                )}

                {/* Spacer */}
                <View className="flex-1" />

                {/* NO PAYMENT DUE NOW pill */}
                <Animated.View entering={FadeInUp.duration(600).delay(420)} className="mb-4">
                    <View className="flex-row items-center justify-center self-center gap-2 border border-emerald-500/40 bg-emerald-500/10 rounded-full px-5 py-2.5">
                        <Ionicons name="shield-checkmark-outline" size={13} color="#34d399" />
                        <Text className="text-emerald-400 text-xs font-bold tracking-widest uppercase">No payment due now</Text>
                    </View>
                </Animated.View>

                {/* CTA */}
                <Animated.View entering={FadeInUp.duration(600).delay(420)}>
                    <SafeAreaView edges={['bottom']}>
                        <Pressable
                            onPress={() => navigation.navigate('Paywall')}
                            className="w-full h-14 rounded-2xl bg-emerald-500 items-center justify-center shadow-lg active:opacity-80 mb-3"
                        >
                            <Text className="text-white text-lg font-bold tracking-wider">
                                See my plan options
                            </Text>
                        </Pressable>
                    </SafeAreaView>
                </Animated.View>
            </SafeAreaView>
        </View></AnimatedSkyBackground>
    );
}
