import type { OnboardingStackParamList } from '@/src/navigation/types';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeInUp, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ValueRevealScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { dailyCost } = useOnboardingStore();

    const yearlySavings = (dailyCost && dailyCost > 0) ? Math.round(dailyCost * 365) : 2500;

    const [displayValue, setDisplayValue] = useState(0);
    const barHeight = useSharedValue(0);

    useEffect(() => {
        barHeight.value = withDelay(400, withTiming(160, { duration: 1200, easing: Easing.out(Easing.back(1.2)) }));

        let startTimestamp: number | null = null;
        const duration = 1200;
        const delay = 400;

        let timeout: NodeJS.Timeout;
        let frame: number;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = timestamp - startTimestamp;
            if (progress < duration) {
                const ease = progress === duration ? 1 : 1 - Math.pow(2, -10 * progress / duration);
                setDisplayValue(Math.floor(ease * yearlySavings));
                frame = requestAnimationFrame(step);
            } else {
                setDisplayValue(yearlySavings);
            }
        };

        timeout = setTimeout(() => {
            frame = requestAnimationFrame(step);
        }, delay);

        return () => {
            clearTimeout(timeout);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [yearlySavings]);

    const animatedBarStyle = useAnimatedStyle(() => ({
        height: barHeight.value,
    }));

    return (
        <SafeAreaView className="flex-1 bg-dark-900 px-6 pt-12 pb-8 justify-between">
            <View className="flex-1 items-center">
                <Animated.View entering={FadeInUp.duration(600)} className="w-full mb-8 items-center">
                    <Text
                        style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 32 }}
                        className="text-white text-center"
                    >
                        Your Future View
                    </Text>
                </Animated.View>

                {/* The Impact Card */}
                <Animated.View
                    entering={FadeIn.duration(800).delay(300)}
                    className="bg-white/8 rounded-3xl p-6 w-full border border-white/10 mb-8 items-center"
                >
                    <Text className="text-white/50 font-bold uppercase tracking-widest text-xs mb-6">By this time next year</Text>

                    <View className="flex-row items-end justify-center mb-8 h-[160px]">
                        <View className="items-center mx-4">
                            <View className="w-12 h-32 bg-red-500/20 rounded-t-lg" />
                            <Text className="text-white/40 text-xs mt-2">Spend</Text>
                        </View>
                        <View className="items-center mx-4">
                            <Animated.View className="w-12 bg-emerald-500 rounded-t-lg" style={animatedBarStyle} />
                            <Text className="text-emerald-400 font-bold text-xs mt-2">Saved</Text>
                        </View>
                    </View>

                    <Text
                        style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 48 }}
                        className="text-emerald-400 mb-2"
                    >
                        ${displayValue.toLocaleString()}
                    </Text>
                    <Text className="text-white/60 text-center px-4">
                        saved and your heart attack risk will have dropped by <Text className="font-bold text-white">50%</Text>.
                    </Text>
                </Animated.View>
            </View>

            <Animated.View entering={FadeInUp.duration(600).delay(2000)} className="w-full">
                <Pressable
                    onPress={() => navigation.navigate('Paywall')}
                    className="w-full bg-white h-14 rounded-2xl items-center justify-center shadow-lg active:opacity-80"
                >
                    <Text className="text-black text-lg font-bold">See My Plan</Text>
                </Pressable>
            </Animated.View>
        </SafeAreaView>
    );
}
