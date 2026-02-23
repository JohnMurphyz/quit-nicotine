import MountainDawnSvg from '@/assets/images/scene-mountain-dawn.svg';
import type { OnboardingStackParamList } from '@/src/navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function AnimatedBackground() {
    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);

    useEffect(() => {
        scale.value = withRepeat(
            withTiming(1.1, { duration: 25000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
        translateX.value = withRepeat(
            withTiming(-15, { duration: 25000, easing: Easing.inOut(Easing.ease) }),
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
                <MountainDawnSvg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
            </Animated.View>

            {/* Dark gradient veil over bottom half for text legibility */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.65)']}
                locations={[0.35, 1]}
                style={StyleSheet.absoluteFill}
            />
        </View>
    );
}

export default function WelcomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-black">
            <AnimatedBackground />

            {/* Centered hero content */}
            <View className="flex-1 items-center justify-center px-8">
                <Animated.View entering={FadeIn.duration(1200).delay(400)} className="items-center">
                    <Text
                        style={{ fontSize: 56, fontFamily: 'AbrilFatface_400Regular', letterSpacing: 4, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 12 }}
                        className="text-white text-center"
                    >
                        FREED
                    </Text>
                    <Animated.View entering={FadeInDown.duration(800).delay(800)}>
                        <Text className="text-white/70 text-lg text-center mt-4 leading-7 px-4">
                            A science-backed plan to crush cravings{'\n'}and reclaim your freedom from nicotine.
                        </Text>
                    </Animated.View>
                </Animated.View>
            </View>

            {/* Bottom CTA */}
            <Animated.View
                entering={FadeInUp.duration(800).delay(1200)}
                style={{ paddingBottom: insets.bottom + 16 }}
                className="px-6"
            >
                <Pressable
                    onPress={() => navigation.navigate('WalkthroughDrug')}
                    className="w-full bg-white h-14 rounded-2xl items-center justify-center shadow-lg active:opacity-80"
                >
                    <Text className="text-black text-lg font-bold">Begin Journey</Text>
                </Pressable>
            </Animated.View>
        </View>
    );
}
