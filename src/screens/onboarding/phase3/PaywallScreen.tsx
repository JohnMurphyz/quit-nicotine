import type { OnboardingStackParamList } from '@/src/navigation/types';
import { useAuthStore } from '@/src/stores/authStore';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { useSubscriptionStore } from '@/src/stores/subscriptionStore';
import { getOfferings, syncSubscriptionToSupabase } from '@/src/lib/revenueCat';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, Image, Linking, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import type { PurchasesPackage } from 'react-native-purchases';
import { PACKAGE_TYPE } from 'react-native-purchases';

type PackageDisplay = {
    title: string;
    badge?: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
};

function getPackageDisplay(pkg: PurchasesPackage): PackageDisplay {
    switch (pkg.packageType) {
        case PACKAGE_TYPE.ANNUAL:
            return { title: 'Annually', badge: 'Best value', icon: 'star-outline', iconColor: '#fbbf24' };
        case PACKAGE_TYPE.MONTHLY:
            return { title: 'Monthly', icon: 'calendar-outline', iconColor: '#60a5fa' };
        case PACKAGE_TYPE.LIFETIME:
            return { title: 'Lifetime', icon: 'diamond-outline', iconColor: '#c084fc' };
        case PACKAGE_TYPE.WEEKLY:
            return { title: 'Weekly', icon: 'time-outline', iconColor: '#34d399' };
        default:
            return { title: pkg.product.localizedTitle || pkg.identifier, icon: 'pricetag-outline', iconColor: '#94a3b8' };
    }
}

function getPeriodLabel(pkg: PurchasesPackage): string {
    switch (pkg.packageType) {
        case PACKAGE_TYPE.ANNUAL:   return 'year';
        case PACKAGE_TYPE.MONTHLY:  return 'month';
        case PACKAGE_TYPE.WEEKLY:   return 'week';
        case PACKAGE_TYPE.LIFETIME: return 'one-time';
        default: return '';
    }
}

function getPackagePriceLines(pkg: PurchasesPackage): { line1: string; line2: string } {
    const intro = pkg.product.introPrice;
    const price = pkg.product.priceString;

    if (intro && intro.price === 0) {
        const n = intro.periodNumberOfUnits;
        const unit = intro.periodUnit.toLowerCase();
        const trialLabel = `${n} ${unit}${n > 1 ? 's' : ''} free`;
        const period = getPeriodLabel(pkg);
        return {
            line1: trialLabel,
            line2: period !== 'one-time' ? `then ${price}/${period},\ncancel anytime` : `then ${price}`,
        };
    }

    switch (pkg.packageType) {
        case PACKAGE_TYPE.ANNUAL:
            return { line1: price, line2: 'per year,\ncancel anytime' };
        case PACKAGE_TYPE.MONTHLY:
            return { line1: `${price}/month`, line2: 'cancel anytime' };
        case PACKAGE_TYPE.WEEKLY:
            return { line1: `${price}/week`, line2: 'cancel anytime' };
        case PACKAGE_TYPE.LIFETIME:
            return { line1: price, line2: 'one time payment' };
        default:
            return { line1: price, line2: '' };
    }
}

export default function PaywallScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { nicotineType, motivations, specificBenefit, readinessLevel } = useOnboardingStore();
    const { purchaseMobile, restorePurchases } = useSubscriptionStore();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [packages, setPackages] = useState<PurchasesPackage[]>([]);

    useEffect(() => {
        if (Platform.OS !== 'web') {
            getOfferings()
                .then((offering) => {
                    if (offering) {
                        setPackages(offering.availablePackages);
                        // Default to annual if present, otherwise first package
                        const annual = offering.availablePackages.find(
                            (p) => p.packageType === PACKAGE_TYPE.ANNUAL
                        );
                        setSelectedId(annual?.identifier ?? offering.availablePackages[0]?.identifier ?? null);
                    }
                })
                .catch(console.error);
        }
    }, []);

    const selectedPackage = packages.find((p) => p.identifier === selectedId);

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

            await useAuthStore.getState().updateProfile({
                onboarding_completed: true,
                nicotine_type: nicotineType,
                daily_cost: useOnboardingStore.getState().dailyCost,
                motivations,
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

        if (!selectedId || packages.length === 0) {
            Alert.alert('Unable to load plans', 'Please check your connection and try again.');
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

            await purchaseMobile(selectedId, currentUser.id);
            await syncSubscriptionToSupabase(currentUser.id);
            await completeOnboarding();
        } catch (error: any) {
            if (!error?.userCancelled) {
                navigation.navigate('PaymentFailed', { message: error?.message });
            }
            setSubmitting(false);
        }
    };

    const handleRestore = async () => {
        setSubmitting(true);
        try {
            let currentUser = useAuthStore.getState().user;
            if (!currentUser) {
                await useAuthStore.getState().signInAnonymously();
                currentUser = useAuthStore.getState().user;
            }
            if (!currentUser) throw new Error('Unable to create session');

            await restorePurchases(currentUser.id);

            if (useSubscriptionStore.getState().isActive) {
                await completeOnboarding();
            } else {
                Alert.alert('No purchases found', 'We couldn\'t find any previous purchases linked to your account.');
                setSubmitting(false);
            }
        } catch {
            Alert.alert('Restore failed', 'Something went wrong. Please try again.');
            setSubmitting(false);
        }
    };

    const [showAllPlans, setShowAllPlans] = useState(false);

    // Monthly-equivalent label for annual plans (e.g. "$3.33/mo")
    const getMonthlyEquiv = (pkg: PurchasesPackage): string | null => {
        if (pkg.packageType !== PACKAGE_TYPE.ANNUAL) return null;
        const symMatch = pkg.product.priceString.match(/^[^\d]*/);
        const sym = symMatch ? symMatch[0] : '';
        return `${sym}${(pkg.product.price / 12).toFixed(2)}/mo`;
    };

    // CTA label and fine print — driven by intro offer on the selected package
    const intro = selectedPackage?.product.introPrice;
    const isAnnual = selectedPackage?.packageType === PACKAGE_TYPE.ANNUAL;
    // Annual plan always has the 3-day trial; RC sandbox may not return intro price
    const hasTrial = !!(intro && intro.price === 0) || isAnnual;
    const trialDuration = (intro && intro.price === 0)
        ? `${intro.periodNumberOfUnits} ${intro.periodUnit.toLowerCase()}${intro.periodNumberOfUnits > 1 ? 's' : ''}`
        : '3 days';
    const periodLabel = selectedPackage ? getPeriodLabel(selectedPackage) : null;
    const priceAfterTrial = selectedPackage?.product.priceString ?? null;

    const ctaLabel = submitting
        ? 'Starting...'
        : hasTrial
        ? `Begin ${trialDuration} free trial`
        : 'Get started';

    const finePrint = hasTrial && priceAfterTrial && periodLabel && periodLabel !== 'one-time'
        ? `After your ${trialDuration} free trial, you'll be charged ${priceAfterTrial}/${periodLabel}. Cancel anytime in Settings > Subscriptions.`
        : priceAfterTrial && periodLabel && periodLabel !== 'one-time'
        ? `You'll be charged ${priceAfterTrial}/${periodLabel}. Cancel anytime in Settings > Subscriptions.`
        : null;

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
                    {/* Back button — overlaid on hero */}
                    <Pressable
                        onPress={() => navigation.goBack()}
                        style={{ position: 'absolute', top: 48, left: 8, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
                        className="active:opacity-60"
                    >
                        <Ionicons name="arrow-back" size={24} color="rgba(255,255,255,0.7)" />
                    </Pressable>
                </View>

                {/* Heading */}
                <Animated.View entering={FadeInUp.duration(600)} className="items-center px-6 mt-4 mb-6">
                    <Text
                        style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 28 }}
                        className="text-white text-center"
                    >
                        Choose your plan
                    </Text>
                </Animated.View>

                {/* Featured plan card — glass */}
                {selectedPackage && (
                    <Animated.View entering={FadeInUp.duration(600).delay(100)} className="px-6 mb-3">
                        <View
                            className="rounded-2xl overflow-hidden"
                            style={{
                                borderWidth: 1,
                                borderColor: hasTrial ? 'rgba(52,211,153,0.35)' : 'rgba(251,191,36,0.35)',
                            }}
                        >
                            <BlurView intensity={28} tint="light" style={{ overflow: 'hidden' }}>
                                {/* Subtle colour wash over the blur */}
                                <LinearGradient
                                    colors={
                                        hasTrial
                                            ? ['rgba(52,211,153,0.18)', 'rgba(52,211,153,0.06)']
                                            : ['rgba(251,191,36,0.18)', 'rgba(251,191,36,0.06)']
                                    }
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    {/* Trial / badge hero */}
                                    {hasTrial ? (
                                        <View className="px-5 pt-5 pb-4">
                                            <View className="flex-row items-center gap-2 self-start bg-emerald-500/25 rounded-full px-3 py-1 mb-3">
                                                <Ionicons name="shield-checkmark-outline" size={12} color="#34d399" />
                                                <Text className="text-emerald-300 text-[11px] font-bold tracking-widest uppercase">Free trial included</Text>
                                            </View>
                                            <Text style={{ fontSize: 32, fontWeight: '800', color: 'white', lineHeight: 36 }}>
                                                {trialDuration} free
                                            </Text>
                                            <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, marginTop: 6 }}>
                                                No charge until day 4 · cancel anytime
                                            </Text>
                                        </View>
                                    ) : (
                                        <View className="px-5 pt-5 pb-4">
                                            <View className="flex-row items-center gap-2 self-start bg-amber-500/25 rounded-full px-3 py-1 mb-3">
                                                <Ionicons name="star-outline" size={12} color="#fbbf24" />
                                                <Text className="text-amber-300 text-[11px] font-bold tracking-widest uppercase">
                                                    {getPackageDisplay(selectedPackage).badge ?? 'Selected plan'}
                                                </Text>
                                            </View>
                                            <Text style={{ fontSize: 28, fontWeight: '800', color: 'white' }}>
                                                {getPackageDisplay(selectedPackage).title}
                                            </Text>
                                        </View>
                                    )}

                                    {/* Divider */}
                                    <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.12)', marginHorizontal: 20 }} />

                                    {/* Price row */}
                                    <View className="px-5 py-4 flex-row items-center justify-between">
                                        <View>
                                            <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>
                                                {getPackageDisplay(selectedPackage).title}
                                            </Text>
                                            <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 2 }}>
                                                {selectedPackage.packageType === PACKAGE_TYPE.ANNUAL
                                                    ? `12 months · ${priceAfterTrial}`
                                                    : selectedPackage.packageType === PACKAGE_TYPE.LIFETIME
                                                    ? 'One-time payment'
                                                    : `${priceAfterTrial}/${periodLabel}`}
                                            </Text>
                                        </View>
                                        <Text style={{ fontSize: 22, fontWeight: '800', color: 'white' }}>
                                            {getMonthlyEquiv(selectedPackage) ?? priceAfterTrial}
                                        </Text>
                                    </View>
                                </LinearGradient>
                            </BlurView>
                        </View>
                    </Animated.View>
                )}

                {/* View All Plans toggle */}
                <Animated.View entering={FadeInUp.duration(600).delay(200)} className="px-6 mb-4">
                    <Pressable
                        onPress={() => setShowAllPlans((v) => !v)}
                        className="flex-row items-center justify-center gap-1.5 py-2 active:opacity-60"
                    >
                        <Text className="text-white/50 text-sm" style={{ textDecorationLine: 'underline' }}>
                            View all plans
                        </Text>
                        <Ionicons
                            name={showAllPlans ? 'chevron-up' : 'chevron-down'}
                            size={14}
                            color="rgba(255,255,255,0.5)"
                        />
                    </Pressable>

                    {/* Expanded plan list */}
                    {showAllPlans && (
                        <View className="mt-2 gap-2">
                            {packages.map((pkg) => {
                                const isSelected = selectedId === pkg.identifier;
                                const display = getPackageDisplay(pkg);
                                const pkgIntro = pkg.product.introPrice;
                                const pkgHasTrial = !!(pkgIntro && pkgIntro.price === 0);
                                const sublabel = pkgHasTrial
                                    ? `${pkgIntro!.periodNumberOfUnits} ${pkgIntro!.periodUnit.toLowerCase()}${pkgIntro!.periodNumberOfUnits > 1 ? 's' : ''} free, then ${pkg.product.priceString}/${getPeriodLabel(pkg)}`
                                    : pkg.packageType === PACKAGE_TYPE.LIFETIME
                                    ? 'One-time payment'
                                    : `${pkg.product.priceString}/${getPeriodLabel(pkg)}`;
                                return (
                                    <Pressable
                                        key={pkg.identifier}
                                        onPress={() => { setSelectedId(pkg.identifier); setShowAllPlans(false); }}
                                        className={`flex-row items-center px-4 py-3 rounded-2xl border gap-3 active:opacity-70 ${
                                            isSelected ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 bg-white/5'
                                        }`}
                                    >
                                        <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${isSelected ? 'border-emerald-400' : 'border-white/30'}`}>
                                            {isSelected && <View className="w-2.5 h-2.5 rounded-full bg-emerald-400" />}
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`font-semibold text-sm ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                                                {display.title}
                                            </Text>
                                            <Text className="text-white/40 text-xs mt-0.5">{sublabel}</Text>
                                        </View>
                                        {display.badge && !pkgHasTrial && (
                                            <View className="bg-amber-500/80 px-2 py-0.5 rounded-md">
                                                <Text className="text-white text-[10px] font-bold">{display.badge}</Text>
                                            </View>
                                        )}
                                    </Pressable>
                                );
                            })}
                        </View>
                    )}
                </Animated.View>

            </ScrollView>

            {/* CTA section */}
            <SafeAreaView edges={['bottom']} className="px-6 pb-4">
                <Animated.View entering={FadeInUp.duration(600).delay(400)}>
                    <Pressable
                        onPress={handlePurchase}
                        disabled={submitting}
                        className={`w-full h-14 rounded-2xl items-center justify-center shadow-lg ${submitting ? 'bg-white/20' : hasTrial ? 'bg-emerald-500 active:opacity-80' : 'bg-white active:opacity-80'}`}
                    >
                        <Text className={`text-lg font-bold tracking-wider ${submitting ? 'text-white/40' : hasTrial ? 'text-white' : 'text-black'}`}>
                            {ctaLabel}
                        </Text>
                    </Pressable>

                    {/* Fine print — required by Apple; fixed-height container prevents layout shift */}
                    <View style={{ minHeight: 44 }} className="mt-3 justify-center">
                        {finePrint && (
                            <Text className="text-white/30 text-xs text-center leading-relaxed px-2">
                                {finePrint}
                            </Text>
                        )}
                    </View>

                    {/* Footer — Restore is required by Apple on hard paywalls */}
                    <View className="flex-row justify-center items-center mt-4 gap-3">
                        <Pressable onPress={handleRestore} disabled={submitting} className="active:opacity-60">
                            <Text className="text-white/40 text-xs">Restore</Text>
                        </Pressable>
                        <Text className="text-white/20 text-xs">•</Text>
                        <Pressable onPress={() => Linking.openURL('https://quitnicotine.app/terms')} className="active:opacity-60">
                            <Text className="text-white/40 text-xs">Terms</Text>
                        </Pressable>
                        <Text className="text-white/20 text-xs">•</Text>
                        <Pressable onPress={() => Linking.openURL('https://quitnicotine.app/privacy')} className="active:opacity-60">
                            <Text className="text-white/40 text-xs">Privacy</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}
