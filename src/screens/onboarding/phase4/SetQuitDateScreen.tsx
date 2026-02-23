import type { OnboardingStackParamList } from '@/src/navigation/types';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

function CalendarGraphic() {
    return (
        <AnimatedSvg
            width={160}
            height={160}
            viewBox="0 0 100 100"
            entering={FadeInUp.duration(600)}
            className="mb-8"
        >
            {/* Abstract Sun / Day */}
            <Circle cx="50" cy="50" r="40" fill="rgba(16,185,129,0.15)" />
            <Path
                d="M20,50 L80,50 M50,20 L50,80"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                opacity={0.4}
            />
            {/* 1 in center */}
            <SvgText fill="#10b981" fontSize="24" fontWeight="bold" x="38" y="58">1</SvgText>
        </AnimatedSvg>
    );
}

export default function SetQuitDateScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { setCostAndQuitDate, dailyCost } = useOnboardingStore();

    const handleSelect = (chooseToday: boolean) => {
        const d = new Date();
        if (!chooseToday) {
            d.setDate(d.getDate() + 7);
        }
        setCostAndQuitDate(dailyCost || 0, d.toISOString());
        navigation.navigate('FinalPledge');
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-900 px-6 pt-10 pb-8 items-center justify-between">
            <View className="flex-1 items-center w-full mt-10">
                <CalendarGraphic />

                <Animated.View entering={FadeInUp.duration(600).delay(200)} className="w-full mb-10 items-center">
                    <Text
                        style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 32 }}
                        className="text-white text-center"
                    >
                        Your Quit Date
                    </Text>
                    <Text className="text-base text-white/50 text-center mt-3 px-4 leading-relaxed">
                        There's never a "perfect" time. But the sooner you start, the sooner you're free.
                    </Text>
                </Animated.View>

                <View className="w-full">
                    <Animated.View entering={FadeInRight.duration(500).delay(400)}>
                        <Pressable
                            onPress={() => handleSelect(true)}
                            className="bg-emerald-500 p-6 rounded-2xl w-full mb-3 items-center active:opacity-80"
                        >
                            <Text className="text-white text-xl font-bold mb-1">Quit Today</Text>
                            <Text className="text-emerald-100/70 text-sm">Start your timer right now.</Text>
                        </Pressable>
                    </Animated.View>

                    <Animated.View entering={FadeInRight.duration(500).delay(500)}>
                        <Pressable
                            onPress={() => handleSelect(false)}
                            className="bg-white/5 p-6 rounded-2xl w-full border border-white/10 items-center active:opacity-80"
                        >
                            <Text className="text-white text-xl font-bold mb-1">Quit in 7 Days</Text>
                            <Text className="text-white/40 text-sm">Prepare yourself for one final week.</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </View>
        </SafeAreaView>
    );
}
