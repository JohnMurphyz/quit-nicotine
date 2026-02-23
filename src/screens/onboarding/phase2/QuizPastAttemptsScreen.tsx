import type { OnboardingStackParamList } from '@/src/navigation/types';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuizProgressHeader } from './QuizProgressHeader';

const OPTIONS = [
    { id: 'YesRecent', label: 'Yes, recently', d: 'Relapse is part of recovery. Let\'s succeed this time.' },
    { id: 'YesLongAgo', label: 'Yes, a long time ago', d: 'Glad you are ready to try again.' },
    { id: 'No', label: 'No, this is my first time', d: 'Perfect. We will guide you step-by-step.' },
];

export default function QuizPastAttemptsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { pastAttempts, setPastAttempts } = useOnboardingStore();

    const handleSelect = (id: string) => {
        setPastAttempts(id);
        setTimeout(() => {
            navigation.navigate('AnalysisLoading');
        }, 200);
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-900 px-6 pt-4">
            <QuizProgressHeader currentStep={5} totalSteps={5} />

            <Animated.View entering={FadeInUp.duration(600)}>
                <Text
                    style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 28 }}
                    className="text-white mb-2"
                >
                    Have you tried quitting?
                </Text>
                <Text className="text-base text-white/50 mb-8">
                    It takes an average of 6 attempts to quit for good. You are not alone.
                </Text>
            </Animated.View>

            <View className="flex-1">
                {OPTIONS.map((opt, index) => {
                    const isSelected = pastAttempts === opt.id;
                    return (
                        <Animated.View
                            key={opt.id}
                            entering={FadeInRight.duration(500).delay(index * 100)}
                        >
                            <Pressable
                                onPress={() => handleSelect(opt.id)}
                                className={`p-5 mb-3 rounded-2xl border ${isSelected
                                    ? 'border-emerald-500 bg-emerald-500/15'
                                    : 'border-white/10 bg-white/5'
                                    } active:opacity-80`}
                            >
                                <Text className={`text-lg font-bold mb-1 ${isSelected ? 'text-emerald-400' : 'text-white'
                                    }`}>
                                    {opt.label}
                                </Text>
                                <Text className={`text-sm ${isSelected ? 'text-emerald-400/70' : 'text-white/40'
                                    }`}>
                                    {opt.d}
                                </Text>
                            </Pressable>
                        </Animated.View>
                    );
                })}
            </View>
        </SafeAreaView>
    );
}
