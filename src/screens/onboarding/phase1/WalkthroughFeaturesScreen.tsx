import CoastalMiddaySvg from '@/assets/images/scene-coastal-midday.svg';
import type { OnboardingStackParamList } from '@/src/navigation/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, FadeInRight, FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function AnimatedBackground() {
    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);

    useEffect(() => {
        scale.value = withRepeat(
            withTiming(1.12, { duration: 30000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
        translateX.value = withRepeat(
            withTiming(20, { duration: 30000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateX: translateX.value }
        ]
    }));

    return (
        <View style={StyleSheet.absoluteFill} className="bg-black">
            <Animated.View
                entering={FadeIn.duration(1500)}
                style={[StyleSheet.absoluteFill, animatedStyle]}
            >
                <CoastalMiddaySvg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
            </Animated.View>
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)']}
                locations={[0.25, 1]}
                style={StyleSheet.absoluteFill}
            />
        </View>
    );
}

function FeatureRow({ icon, title, delay }: { icon: string, title: string, delay: number }) {
    return (
        <Animated.View
            entering={FadeInRight.duration(500).delay(delay)}
            className="flex-row items-center bg-white/10 p-3.5 rounded-2xl mb-3 w-full"
        >
            <View className="bg-white/15 w-11 h-11 rounded-full items-center justify-center mr-3.5">
                <Ionicons name={icon as any} size={22} color="white" />
            </View>
            <Text className="text-white font-semibold text-base">{title}</Text>
        </Animated.View>
    );
}

function PagerDots({ activeIndex }: { activeIndex: number }) {
    return (
        <View className="flex-row justify-center py-4">
            {[0, 1, 2].map((i) => (
                <View
                    key={i}
                    style={{ width: i === activeIndex ? 10 : 8, height: i === activeIndex ? 10 : 8, borderRadius: 5, marginHorizontal: 5, backgroundColor: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.3)' }}
                />
            ))}
        </View>
    );
}

export default function WalkthroughFeaturesScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-black">
            <AnimatedBackground />

            {/* Floating brand mark */}
            <View style={{ paddingTop: insets.top + 12 }} className="absolute top-0 w-full flex-row justify-center items-center z-10">
                <Text style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 20, letterSpacing: 2, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 8 }} className="text-white/60">
                    FREED
                </Text>
            </View>

            <View className="flex-1 justify-end px-6" style={{ paddingBottom: insets.bottom + 16 }}>
                {/* Floating heading */}
                <Animated.View entering={FadeInDown.duration(700).delay(300)}>
                    <Text
                        style={{ fontSize: 36, fontFamily: 'AbrilFatface_400Regular', letterSpacing: 1, textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 12 }}
                        className="text-white text-center mb-2"
                    >
                        Your Toolkit
                    </Text>
                    <Text className="text-white/70 text-base text-center mb-5">
                        Everything you need to quit for good.
                    </Text>
                </Animated.View>

                {/* Glass card with feature rows */}
                <Animated.View entering={FadeInDown.duration(800).delay(500)} className="w-full">
                    <BlurView intensity={60} tint="systemMaterialDark" className="rounded-3xl p-5 overflow-hidden">
                        <FeatureRow icon="shield-checkmark" title="Daily Pledges" delay={600} />
                        <FeatureRow icon="time" title="Recovery Timer" delay={750} />
                        <FeatureRow icon="people" title="Accountability Partner" delay={900} />
                    </BlurView>
                </Animated.View>

                {/* Dots below card */}
                <PagerDots activeIndex={2} />

                {/* CTA */}
                <Animated.View entering={FadeInUp.duration(600).delay(1100)}>
                    <Pressable
                        onPress={() => navigation.navigate('QuizNicotineType')}
                        className="w-full bg-white h-14 rounded-2xl items-center justify-center flex-row shadow-lg active:opacity-80"
                    >
                        <Text className="text-black text-lg font-bold mr-2">Personalize My Plan</Text>
                        <Ionicons name="chevron-forward" size={20} color="black" />
                    </Pressable>
                </Animated.View>
            </View>
        </View>
    );
}
