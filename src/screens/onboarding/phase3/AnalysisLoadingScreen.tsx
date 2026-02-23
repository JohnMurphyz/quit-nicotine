import type { OnboardingStackParamList } from '@/src/navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';



const LOADING_TEXTS = [
    "Analyzing your habit profile...",
    "Calculating financial impact...",
    "Identifying crucial triggers...",
    "Building your personalized quit plan..."
];

function PulseCircle() {
    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0.8);

    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.5, { duration: 1500, easing: Easing.out(Easing.ease) }),
                withTiming(0.8, { duration: 0 })
            ),
            -1
        );
        opacity.value = withRepeat(
            withSequence(
                withTiming(0, { duration: 1500, easing: Easing.out(Easing.ease) }),
                withTiming(0.8, { duration: 0 })
            ),
            -1
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <View className="mb-12 items-center justify-center" style={{ width: 200, height: 200 }}>
            {/* Static center dot */}
            <Svg width={200} height={200} viewBox="0 0 100 100" style={{ position: 'absolute' }}>
                <Circle cx="50" cy="50" r="8" fill="#10b981" />
            </Svg>
            {/* Pulsing ring */}
            <Animated.View style={[{ position: 'absolute', width: 200, height: 200 }, animatedStyle]}>
                <Svg width={200} height={200} viewBox="0 0 100 100">
                    <Circle cx="50" cy="50" r="30" fill="none" stroke="#10b981" strokeWidth="2" />
                </Svg>
            </Animated.View>
        </View>
    );
}

export default function AnalysisLoadingScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const [textIndex, setTextIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex((prev) => (prev < LOADING_TEXTS.length - 1 ? prev + 1 : prev));
        }, 1200);

        const timeout = setTimeout(() => {
            navigation.navigate('ValueReveal');
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [navigation]);

    return (
        <SafeAreaView className="flex-1 bg-dark-900 justify-center items-center px-6">
            <Animated.View entering={FadeIn.duration(800)} className="items-center w-full">
                <PulseCircle />

                <View className="h-16 items-center justify-center">
                    <Text
                        key={textIndex}
                        style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 20 }}
                        className="text-white text-center"
                    >
                        {LOADING_TEXTS[textIndex]}
                    </Text>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
}
