import type { OnboardingStackParamList } from '@/src/navigation/types';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuizProgressHeader } from './QuizProgressHeader';

const OPTIONS = [
    { id: 'WakingUp', label: 'Waking up / Morning routine' },
    { id: 'AfterMeals', label: 'After eating a meal' },
    { id: 'Stress', label: 'Feeling stressed or anxious' },
    { id: 'Socializing', label: 'Socializing / Drinking' },
    { id: 'Driving', label: 'Driving or commuting' },
    { id: 'Boredom', label: 'Feeling bored or under-stimulated' },
];

export default function QuizTriggersScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { triggers, setTriggers } = useOnboardingStore();
    const [selected, setSelected] = useState<Set<string>>(new Set(triggers));

    const toggleTrigger = (id: string) => {
        const next = new Set(selected);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelected(next);
    };

    const handleNext = () => {
        setTriggers(Array.from(selected));
        navigation.navigate('QuizPastAttempts');
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
                {OPTIONS.map((opt, index) => {
                    const isSelected = selected.has(opt.id);
                    return (
                        <Animated.View
                            key={opt.id}
                            entering={FadeInRight.duration(400).delay(index * 100)}
                            style={{ width: '48%' }}
                            className="mb-3"
                        >
                            <Pressable
                                onPress={() => toggleTrigger(opt.id)}
                                className={`py-4 px-3 rounded-2xl border items-center justify-center min-h-[80px] ${isSelected
                                    ? 'border-emerald-500 bg-emerald-500/15'
                                    : 'border-white/10 bg-white/5'
                                    } active:opacity-80`}
                            >
                                <Text className={`text-center font-bold ${isSelected ? 'text-emerald-400' : 'text-white'
                                    }`}>
                                    {opt.label}
                                </Text>
                            </Pressable>
                        </Animated.View>
                    );
                })}
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
