import type { OnboardingStackParamList } from '@/src/navigation/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image, Pressable, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function PaywallTrialIntroScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

    return (
        <View className="flex-1 bg-[#0f0d2e]">
            {/* Hero image — full bleed */}
            <View style={{ height: 280 }}>
                <Image
                    source={require('@/assets/images/scene-sunrise-hero.png')}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', '#0f0d2e']}
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 140 }}
                />
            </View>

            {/* Content */}
            <View className="flex-1 px-6">
                <Animated.View entering={FadeInUp.duration(600).delay(0)}>
                    <Text
                        style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 32 }}
                        className="text-white text-center mt-5 mb-3"
                    >
                        {"The first 3 days\nare the hardest."}
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.duration(600).delay(100)}>
                    <Text className="text-white/60 text-base leading-relaxed text-center">
                        We'll support you through the worst of the cravings — on us.
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.duration(600).delay(200)} className="flex-row items-center justify-center gap-2 mt-3">
                    <Ionicons name="notifications-outline" size={14} color="rgba(255,255,255,0.35)" />
                    <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>
                        We'll remind you before day 4 — no surprise charges.
                    </Text>
                </Animated.View>

                {/* Spacer pushes timeline + CTA to the bottom */}
                <View className="flex-1" />

                {/* Trial timeline — anchored near the CTA */}
                <Animated.View entering={FadeInUp.duration(600).delay(300)} className="px-2 mb-8">
                    <View className="flex-row items-center justify-between">
                        <View className="items-center flex-1">
                            <Text className="text-white/50 text-xs mb-2">Today</Text>
                            <View className="w-3 h-3 rounded-full bg-emerald-500" />
                            <Text className="text-white/50 text-xs mt-2 text-center">Free trial</Text>
                        </View>
                        <View className="flex-1 h-[1px] bg-white/20 mb-[18px]" />
                        <View className="items-center flex-1">
                            <Text className="text-white/50 text-xs mb-2">Day 4</Text>
                            <View className="w-3 h-3 rounded-full bg-white/30" />
                            <Text className="text-white/50 text-xs mt-2 text-center">Reminder</Text>
                        </View>
                        <View className="flex-1 h-[1px] bg-white/20 mb-[18px]" />
                        <View className="items-center flex-1">
                            <Text className="text-white/50 text-xs mb-2">Ongoing</Text>
                            <View className="w-3 h-3 rounded-full bg-white/30" />
                            <Text className="text-white/50 text-xs mt-2 text-center">Billed annually</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* NO PAYMENT DUE NOW pill */}
                <Animated.View entering={FadeInUp.duration(600).delay(400)} className="mb-4">
                    <View className="flex-row items-center justify-center self-center gap-2 border border-emerald-500/40 bg-emerald-500/10 rounded-full px-5 py-2.5">
                        <Ionicons name="shield-checkmark-outline" size={13} color="#34d399" />
                        <Text className="text-emerald-400 text-xs font-bold tracking-widest uppercase">No payment due now</Text>
                    </View>
                </Animated.View>

                {/* CTA */}
                <Animated.View entering={FadeInUp.duration(600).delay(500)}>
                    <SafeAreaView edges={['bottom']}>
                        <Pressable
                            onPress={() => navigation.navigate('PaywallInsights')}
                            className="w-full h-14 rounded-2xl bg-emerald-500 items-center justify-center shadow-lg active:opacity-80 mb-3"
                        >
                            <Text className="text-white text-lg font-bold tracking-wider">
                                Start my free 3-day trial
                            </Text>
                        </Pressable>
                        <Text className="text-white/30 text-xs text-center pb-2">
                            3 days free · cancel anytime
                        </Text>
                    </SafeAreaView>
                </Animated.View>
            </View>
        </View>
    );
}
