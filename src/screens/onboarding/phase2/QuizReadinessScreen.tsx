import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import type { OnboardingStackParamList } from '@/src/navigation/types';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Animated, {
    FadeIn,
    FadeInRight,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuizProgressHeader } from './QuizProgressHeader';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const OPTIONS = [
    { id: 4, icon: '🔥', label: 'Fully committed', d: "I'm done. No looking back." },
    { id: 3, icon: '💪', label: 'Ready but nervous', d: "I know it'll be hard, but I'm in." },
    { id: 2, icon: '🤔', label: 'Cautiously optimistic', d: "I want to try, but I'm not sure I can." },
    { id: 1, icon: '🌱', label: 'Just exploring', d: "I'm not ready yet, but I'm curious." },
];

function OptionCard({ opt, index, isSelected, onSelect }: {
    opt: typeof OPTIONS[number];
    index: number;
    isSelected: boolean;
    onSelect: (id: number) => void;
}) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = useCallback(() => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    }, []);

    const handlePressOut = useCallback(() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }, []);

    return (
        <Animated.View
            entering={FadeInRight.duration(500).delay(index * 100)}
        >
            <AnimatedPressable
                onPress={() => onSelect(opt.id)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={animatedStyle}
                className={`flex-row items-center p-5 mb-3 rounded-2xl border ${isSelected
                    ? 'border-emerald-500 bg-emerald-500/15'
                    : 'border-white/10 bg-white/5'
                    }`}
            >
                <Text className="text-3xl mr-4">{opt.icon}</Text>
                <View className="flex-1">
                    <Text className={`text-lg font-bold mb-1 ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                        {opt.label}
                    </Text>
                    <Text className={`text-sm ${isSelected ? 'text-emerald-400/70' : 'text-white/40'}`}>
                        {opt.d}
                    </Text>
                </View>
                {isSelected && (
                    <Animated.View entering={FadeIn.duration(200)}>
                        <Ionicons name="checkmark-circle" size={22} color="#34d399" />
                    </Animated.View>
                )}
            </AnimatedPressable>
        </Animated.View>
    );
}

export default function QuizReadinessScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { readinessLevel, setReadinessLevel } = useOnboardingStore();

    const handleSelect = (level: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setReadinessLevel(level);
        setTimeout(() => {
            navigation.navigate('PersonalizedResults');
        }, 200);
    };

    return (
        <AnimatedSkyBackground>
            <SafeAreaView className="flex-1 px-6 pt-4">
                <QuizProgressHeader currentStep={5} totalSteps={5} />

                <Animated.View entering={FadeInUp.duration(500)}>
                    <Image
                        source={require('@/assets/images/quiz-readiness-hero.png')}
                        style={{ width: '100%', height: 140, borderRadius: 16, opacity: 0.85 }}
                        resizeMode="cover"
                    />
                </Animated.View>

                <Animated.View entering={FadeInUp.duration(600)} style={{ marginTop: 16 }}>
                    <Text
                        style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 28 }}
                        className="text-white mb-2"
                    >
                        How ready do you feel?
                    </Text>
                    <Text className="text-base text-white/50 mb-8">
                        No wrong answer. We'll meet you where you are.
                    </Text>
                </Animated.View>

                <View className="flex-1">
                    {OPTIONS.map((opt, index) => (
                        <OptionCard
                            key={opt.id}
                            opt={opt}
                            index={index}
                            isSelected={readinessLevel === opt.id}
                            onSelect={handleSelect}
                        />
                    ))}
                </View>
            </SafeAreaView>
        </AnimatedSkyBackground>
    );
}
