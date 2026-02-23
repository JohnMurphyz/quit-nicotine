import type { OnboardingStackParamList } from '@/src/navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaywallScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');

    const handleSubscribe = () => {
        navigation.navigate('AuthCreation');
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-900 px-6 pt-10 pb-8 justify-between">
            <View className="flex-1">
                <Animated.View entering={FadeInUp.duration(600)}>
                    <Text
                        style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 32 }}
                        className="text-white mb-3"
                    >
                        Unlock Your Freedom
                    </Text>
                    <Text className="text-base text-white/50 mb-8 leading-relaxed">
                        Get your personalized quit plan, daily CBT exercises, and emergency SOS tools.
                    </Text>
                </Animated.View>

                {/* Plan Toggles */}
                <Animated.View entering={FadeIn.duration(600).delay(300)}>
                    {/* Annual Plan (Pre-selected) */}
                    <Pressable
                        onPress={() => setSelectedPlan('annual')}
                        className={`p-5 mb-3 rounded-2xl border ${selectedPlan === 'annual'
                            ? 'border-emerald-500 bg-emerald-500/15'
                            : 'border-white/10 bg-white/5'
                            } active:opacity-80`}
                    >
                        <View className="flex-row justify-between items-center mb-1">
                            <Text className="text-white font-bold text-lg">Annual Plan</Text>
                            <View className="bg-emerald-500 px-2.5 py-1 rounded-lg">
                                <Text className="text-white text-xs font-bold">SAVE 60%</Text>
                            </View>
                        </View>
                        <Text className="text-white/40 text-sm mb-2">7 days free, then $59.99/year</Text>
                        <Text className="text-emerald-400 font-bold">$4.99 / month</Text>
                    </Pressable>

                    {/* Monthly Plan */}
                    <Pressable
                        onPress={() => setSelectedPlan('monthly')}
                        className={`p-5 mb-8 rounded-2xl border ${selectedPlan === 'monthly'
                            ? 'border-emerald-500 bg-emerald-500/15'
                            : 'border-white/10 bg-white/5'
                            } active:opacity-80`}
                    >
                        <View className="flex-row justify-between items-center mb-1">
                            <Text className="text-white font-bold text-lg">Monthly Plan</Text>
                        </View>
                        <Text className="text-white/40 text-sm mb-2">7 days free, then $12.99/month</Text>
                        <Text className="text-white/60 font-bold">$12.99 / month</Text>
                    </Pressable>
                </Animated.View>

                {/* Social Proof */}
                <Animated.View entering={FadeInUp.duration(600).delay(500)} className="items-center bg-white/5 border border-white/10 rounded-2xl py-4 flex-row justify-center">
                    <Text className="text-2xl mr-3">🤝</Text>
                    <Text className="text-white/60">
                        Join <Text className="font-bold text-white">50,000+</Text> others who quit this year.
                    </Text>
                </Animated.View>
            </View>

            <Animated.View entering={FadeInUp.duration(600).delay(700)} className="w-full">
                <Pressable
                    onPress={handleSubscribe}
                    className="w-full bg-white h-14 rounded-2xl items-center justify-center shadow-lg active:opacity-80"
                >
                    <Text className="text-black text-lg font-bold">Start 7-Day Free Trial</Text>
                </Pressable>
                <View className="items-center mt-4 mb-2">
                    <Text className="text-xs text-white/30">Cancel anytime. Secure checkout.</Text>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
}
