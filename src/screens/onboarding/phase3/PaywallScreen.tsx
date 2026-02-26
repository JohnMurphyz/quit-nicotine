import { useAuthStore } from '@/src/stores/authStore';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { useSubscriptionStore } from '@/src/stores/subscriptionStore';
import { getOfferings, syncSubscriptionToSupabase } from '@/src/lib/revenueCat';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Alert, Image, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { PurchasesPackage } from 'react-native-purchases';

type Plan = 'monthly' | 'annual' | 'lifetime';

const PLAN_CONFIG: Record<Plan, { title: string; badge?: string; icon: keyof typeof Ionicons.glyphMap; iconColor: string; rcIdentifier: string }> = {
    monthly: { title: 'Monthly', icon: 'calendar-outline', iconColor: '#60a5fa', rcIdentifier: 'monthly' },
    annual: { title: 'Annually', badge: '-50%', icon: 'star-outline', iconColor: '#fbbf24', rcIdentifier: 'yearly' },
    lifetime: { title: 'Lifetime', icon: 'diamond-outline', iconColor: '#c084fc', rcIdentifier: 'lifetime' },
};

const SUBTITLES: Record<Plan, string> = {
    annual: 'Get through the worst with us. Stay if you like.',
    monthly: 'Full access to every tool, updated weekly.',
    lifetime: 'One purchase. Yours forever.',
};

const FALLBACK_PLANS: { id: Plan; line1: string; line2: string }[] = [
    { id: 'monthly', line1: '$3.99/month', line2: 'cancel anytime' },
    { id: 'annual', line1: '3 days free', line2: 'then $19.99/year,\ncancel anytime' },
    { id: 'lifetime', line1: '$39.99', line2: 'one time payment' },
];

export default function PaywallScreen() {
    const { nicotineType, motivations, specificBenefit, readinessLevel } = useOnboardingStore();
    const { user, updateProfile } = useAuthStore();
    const { purchaseMobile } = useSubscriptionStore();
    const [selectedPlan, setSelectedPlan] = useState<Plan>('annual');
    const [submitting, setSubmitting] = useState(false);
    const [packages, setPackages] = useState<PurchasesPackage[]>([]);

    useEffect(() => {
        if (Platform.OS !== 'web') {
            getOfferings().then(setPackages).catch(console.error);
        }
    }, []);

    const getPackageForPlan = (planId: Plan): PurchasesPackage | undefined => {
        const config = PLAN_CONFIG[planId];
        return packages.find((p) => p.identifier === config.rcIdentifier);
    };

    const getPlanDisplay = (planId: Plan): { line1: string; line2: string } => {
        const pkg = getPackageForPlan(planId);
        if (!pkg) {
            const fallback = FALLBACK_PLANS.find((f) => f.id === planId)!;
            return { line1: fallback.line1, line2: fallback.line2 };
        }

        const price = pkg.product.priceString;
        switch (planId) {
            case 'monthly':
                return { line1: `${price}/month`, line2: 'cancel anytime' };
            case 'annual':
                return { line1: '3 days free', line2: `then ${price}/year,\ncancel anytime` };
            case 'lifetime':
                return { line1: price, line2: 'one time payment' };
        }
    };

    const completeOnboarding = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
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

    const handlePurchase = async () => {
        if (submitting) return;

        const pkg = getPackageForPlan(selectedPlan);
        if (!pkg) {
            // No packages loaded — just complete onboarding
            await completeOnboarding();
            return;
        }

        setSubmitting(true);
        try {
            let currentUser = useAuthStore.getState().user;
            if (!currentUser) {
                await useAuthStore.getState().signInAnonymously();
                currentUser = useAuthStore.getState().user;
            }
            if (!currentUser) throw new Error('Unable to create session');

            await purchaseMobile(pkg.identifier, currentUser.id);
            await syncSubscriptionToSupabase(currentUser.id);
            await completeOnboarding();
        } catch (error: any) {
            if (error?.userCancelled) {
                // User cancelled — do nothing
            } else {
                Alert.alert('Purchase Failed', error?.message ?? 'Something went wrong. Please try again.');
            }
            setSubmitting(false);
        }
    };

    const plans = (['monthly', 'annual', 'lifetime'] as Plan[]).map((id) => ({
        id,
        ...PLAN_CONFIG[id],
        ...getPlanDisplay(id),
    }));

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
                    {plans.map((plan) => {
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
                        onPress={handlePurchase}
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
