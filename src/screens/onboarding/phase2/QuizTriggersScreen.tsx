import type { OnboardingStackParamList } from '@/src/navigation/types';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
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
    { id: 'WakingUp', icon: '☀️', label: 'Waking up / Morning routine' },
    { id: 'AfterMeals', icon: '🍽️', label: 'After eating a meal' },
    { id: 'Stress', icon: '😰', label: 'Feeling stressed or anxious' },
    { id: 'Socializing', icon: '🍻', label: 'Socializing / Drinking' },
    { id: 'Driving', icon: '🚗', label: 'Driving or commuting' },
    { id: 'Boredom', icon: '😐', label: 'Feeling bored' },
    { id: 'Coffee', icon: '☕', label: 'With coffee / breaks' },
    { id: 'BeforeBed', icon: '🌙', label: 'Before bed' },
];

function TriggerCard({ opt, index, isSelected, onToggle }: {
    opt: typeof OPTIONS[number];
    index: number;
    isSelected: boolean;
    onToggle: (id: string) => void;
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
            entering={FadeInRight.duration(400).delay(index * 80)}
            style={{ width: '48%' }}
            className="mb-3"
        >
            <AnimatedPressable
                onPress={() => onToggle(opt.id)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={animatedStyle}
                className={`py-4 px-3 rounded-2xl border items-center justify-center min-h-[96px] ${isSelected
                    ? 'border-emerald-500 bg-emerald-500/15'
                    : 'border-white/10 bg-white/5'
                    }`}
            >
                <Text className="text-2xl mb-2">{opt.icon}</Text>
                <Text className={`text-center font-bold text-sm ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                    {opt.label}
                </Text>
                {isSelected && (
                    <Animated.View entering={FadeIn.duration(200)} className="absolute top-2 right-2">
                        <Ionicons name="checkmark-circle" size={18} color="#34d399" />
                    </Animated.View>
                )}
            </AnimatedPressable>
        </Animated.View>
    );
}

export default function QuizTriggersScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { triggers, setTriggers } = useOnboardingStore();
    const [selected, setSelected] = useState<Set<string>>(new Set(triggers));

    const toggleTrigger = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const next = new Set(selected);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelected(next);
    };

    const handleNext = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setTriggers(Array.from(selected));
        navigation.navigate('QuizReadiness');
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-900 px-6 pt-4">
            <QuizProgressHeader currentStep={4} totalSteps={5} />

            <Animated.View entering={FadeInUp.duration(600)}>
                <Text
                    style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 28 }}
                    className="text-white mb-2"
                >
                    When do cravings hit?
                </Text>
                <Text className="text-base text-white/50 mb-8">
                    Select all that apply so we can customize your SOS tools.
                </Text>
            </Animated.View>

            <View className="flex-1 flex-row flex-wrap justify-between">
                {OPTIONS.map((opt, index) => (
                    <TriggerCard
                        key={opt.id}
                        opt={opt}
                        index={index}
                        isSelected={selected.has(opt.id)}
                        onToggle={toggleTrigger}
                    />
                ))}
            </View>

            <Animated.View entering={FadeInUp.duration(600).delay(400)} className="w-full pb-8">
                <Pressable
                    onPress={handleNext}
                    disabled={selected.size === 0}
                    className={`w-full h-14 rounded-2xl items-center justify-center ${selected.size > 0 ? 'bg-white active:opacity-80' : 'bg-white/20'}`}
                >
                    <Text className={`text-lg font-bold ${selected.size > 0 ? 'text-black' : 'text-white/40'}`}>Next</Text>
                </Pressable>
            </Animated.View>
        </SafeAreaView>
    );
}
