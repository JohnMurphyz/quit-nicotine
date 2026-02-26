import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
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
    { id: 'Health', icon: '❤️', label: 'My health', d: 'Breathe easier, live longer' },
    { id: 'Money', icon: '💰', label: 'Save money', d: 'Stop burning cash on nicotine' },
    { id: 'Family', icon: '👨‍👩‍👧', label: 'My family', d: 'Be present and healthy for them' },
    { id: 'Freedom', icon: '🦅', label: 'Freedom', d: 'No more planning life around cravings' },
    { id: 'Fitness', icon: '🏃', label: 'Fitness', d: 'Better workouts, faster recovery' },
    { id: 'MentalClarity', icon: '🧠', label: 'Mental clarity', d: 'Less brain fog, more focus' },
];

function OptionCard({ opt, index, isSelected, onToggle }: {
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
            entering={FadeInRight.duration(500).delay(index * 80)}
        >
            <AnimatedPressable
                onPress={() => onToggle(opt.id)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={animatedStyle}
                className={`flex-row items-center p-4 mb-3 rounded-2xl border ${isSelected
                    ? 'border-emerald-500 bg-emerald-500/15'
                    : 'border-white/10 bg-white/5'
                    }`}
            >
                <Text className="text-3xl mr-4">{opt.icon}</Text>
                <View className="flex-1">
                    <Text className={`text-lg font-bold mb-0.5 ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                        {opt.label}
                    </Text>
                    <Text className={`text-sm ${isSelected ? 'text-emerald-400/70' : 'text-white/40'}`}>{opt.d}</Text>
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

export default function QuizWhyScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { motivations, setMotivations, setSpecificBenefit } = useOnboardingStore();
    const [selected, setSelected] = useState<Set<string>>(new Set(motivations));

    const toggleOption = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const next = new Set(selected);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelected(next);
    };

    const handleNext = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const arr = Array.from(selected);
        setMotivations(arr);
        setSpecificBenefit(arr[0] || null);
        navigation.navigate('QuizTriggers');
    };

    return (
        <AnimatedSkyBackground>
            <SafeAreaView className="flex-1 px-6 pt-4">
                <QuizProgressHeader currentStep={3} totalSteps={5} />

                <Animated.View entering={FadeInUp.duration(600)}>
                    <Text
                        style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 28 }}
                        className="text-white mb-2"
                    >
                        What drives you?
                    </Text>
                    <Text className="text-base text-white/50 mb-8">
                        Select everything that resonates. Your top pick powers your pledge.
                    </Text>
                </Animated.View>

                <View className="flex-1">
                    {OPTIONS.map((opt, index) => (
                        <OptionCard
                            key={opt.id}
                            opt={opt}
                            index={index}
                            isSelected={selected.has(opt.id)}
                            onToggle={toggleOption}
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
        </AnimatedSkyBackground>
    );
}
