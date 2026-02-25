import { useAuthStore } from '@/src/stores/authStore';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

type Plan = 'monthly' | 'annual' | 'lifetime';

const PLANS: { id: Plan; title: string; line1: string; line2: string; badge?: string; icon: keyof typeof Ionicons.glyphMap; iconColor: string }[] = [
    { id: 'monthly', title: 'Monthly', line1: '$3.99/month', line2: 'cancel anytime', icon: 'calendar-outline', iconColor: '#60a5fa' },
    { id: 'annual', title: 'Annually', line1: '3 days free', line2: 'then $19.99/year,\ncancel anytime', badge: '-50%', icon: 'star-outline', iconColor: '#fbbf24' },
    { id: 'lifetime', title: 'Lifetime', line1: '$39.99', line2: 'one time payment', icon: 'diamond-outline', iconColor: '#c084fc' },
];

const SUBTITLES: Record<Plan, string> = {
    annual: 'Get through the worst with us. Stay if you like.',
    monthly: 'Full access to every tool, updated weekly.',
    lifetime: 'One purchase. Yours forever.',
};

export default function PaywallScreen() {
    const { nicotineType, motivations, specificBenefit, readinessLevel } = useOnboardingStore();
    const { user, updateProfile } = useAuthStore();
    const [selectedPlan, setSelectedPlan] = useState<Plan>('annual');
    const [submitting, setSubmitting] = useState(false);

    const completeOnboarding = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            // Ensure we have a user — fall back to anonymous sign-in if needed
            let currentUser = useAuthStore.getState().user;
            if (!currentUser) {
                await useAuthStore.getState().signInAnonymously();
                currentUser = useAuthStore.getState().user;
            }
            if (!currentUser) throw new Error('Unable to create session');

            await updateProfile({
                onboarding_completed: true,
                nicotine_type: nicotineType,
                daily_cost: useOnboardingStore.getState().dailyCost,
                motivations: motivations,
                specific_benefit: specificBenefit,
                readiness_level: readinessLevel,
            });
        } catch (e) {
            console.error('Failed to complete onboarding:', e);
            setSubmitting(false);
        }
    };

    return (
        <View className="flex-1 bg-dark-900">
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 16 }}>
                {/* Hero image — full bleed */}
                <View style={{ height: 240, marginTop: -10 }}>
                    <Image
                        source={require('@/assets/images/scene-sunrise-hero.png')}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['transparent', '#0f0d2e']}
                        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 }}
                    />
                </View>

                {/* Heading */}
                <Animated.View entering={FadeInUp.duration(600)} className="items-center px-6 mt-4 mb-6">
                    <Text
                        style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 28 }}
                        className="text-white text-center mb-2"
                    >
                        Freedom starts here
                    </Text>
                    <Text className="text-base text-white/60 leading-relaxed text-center">
                        {SUBTITLES[selectedPlan]}
                    </Text>
                </Animated.View>

                {/* Plan cards — three across */}
                <Animated.View entering={FadeInUp.duration(600).delay(200)} className="flex-row justify-between px-6 mb-8">
                    {PLANS.map((plan) => {
                        const isSelected = selectedPlan === plan.id;
                        return (
                            <Pressable
                                key={plan.id}
                                onPress={() => setSelectedPlan(plan.id)}
                                className={`w-[31%] rounded-2xl border p-4 items-center ${isSelected
                                    ? 'border-emerald-500 bg-emerald-500/15'
                                    : 'border-white/10 bg-white/5'
                                } active:opacity-80`}
                            >
                                {plan.badge ? (
                                    <View className="self-center bg-emerald-500 px-2.5 py-0.5 rounded-lg mb-2">
                                        <Text className="text-white text-[10px] font-bold">{plan.badge}</Text>
                                    </View>
                                ) : (
                                    <View className="h-[18px] mb-2" />
                                )}
                                <Text className="text-white font-bold text-lg mb-1">{plan.title}</Text>
                                <Text className="text-white/60 text-xs leading-relaxed text-center">{plan.line1}</Text>
                                <Text className="text-white/40 text-xs leading-relaxed text-center">{plan.line2}</Text>
                                <View
                                    className="w-10 h-10 rounded-full items-center justify-center mt-3"
                                    style={{ backgroundColor: plan.iconColor + '25' }}
                                >
                                    <Ionicons name={plan.icon} size={20} color={plan.iconColor} />
                                </View>
                            </Pressable>
                        );
                    })}
                </Animated.View>

                {/* Timeline */}
                <Animated.View entering={FadeInUp.duration(600).delay(300)} className="px-8 mb-6">
                    {/* Step 1 — Today */}
                    <View className="flex-row">
                        <View className="items-center mr-4">
                            <View className="w-10 h-10 rounded-full bg-emerald-500/20 items-center justify-center">
                                <Ionicons name="lock-open-outline" size={18} color="#34d399" />
                            </View>
                            <View className="w-0.5 flex-1 bg-emerald-500/20 my-1" />
                        </View>
                        <View className="flex-1 pb-5">
                            <Text className="text-white font-bold text-base">Today</Text>
                            <Text className="text-white/50 text-sm leading-relaxed mt-0.5">
                                Unlock everything — craving tools, meditations, and your personal quit plan.
                            </Text>
                        </View>
                    </View>

                    {/* Step 2 — Day 2 */}
                    <View className="flex-row">
                        <View className="items-center mr-4">
                            <View className="w-10 h-10 rounded-full bg-amber-500/20 items-center justify-center">
                                <Ionicons name="notifications-outline" size={18} color="#fbbf24" />
                            </View>
                            <View className="w-0.5 flex-1 bg-emerald-500/20 my-1" />
                        </View>
                        <View className="flex-1 pb-5">
                            <Text className="text-white font-bold text-base">In 2 days</Text>
                            <Text className="text-white/50 text-sm leading-relaxed mt-0.5">
                                We'll remind you before your trial ends. No surprises, ever.
                            </Text>
                        </View>
                    </View>

                    {/* Step 3 — Day 3 */}
                    <View className="flex-row">
                        <View className="items-center mr-4">
                            <View className="w-10 h-10 rounded-full bg-emerald-500/20 items-center justify-center">
                                <Ionicons name="heart-outline" size={18} color="#34d399" />
                            </View>
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-bold text-base">In 3 days</Text>
                            <Text className="text-white/50 text-sm leading-relaxed mt-0.5">
                                You'll already feel the difference. Stay with us if you like — <Text className="text-emerald-400 font-semibold">cancel anytime</Text>.
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>

            {/* CTA section */}
            <SafeAreaView edges={['bottom']} className="px-6 pb-4">
                <Animated.View entering={FadeInUp.duration(600).delay(400)}>
                    <Pressable
                        onPress={completeOnboarding}
                        disabled={submitting}
                        className={`w-full h-14 rounded-2xl items-center justify-center shadow-lg ${submitting ? 'bg-white/20' : 'bg-white active:opacity-80'}`}
                    >
                        <Text className={`text-lg font-bold tracking-wider ${submitting ? 'text-white/40' : 'text-black'}`}>
                            {submitting ? 'Starting...' : 'START FOR FREE'}
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={completeOnboarding}
                        disabled={submitting}
                        className="w-full items-center mt-4 active:opacity-60"
                    >
                        <Text className="text-white/40 text-base">Continue with free plan</Text>
                    </Pressable>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}
