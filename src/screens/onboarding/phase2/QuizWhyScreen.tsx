import type { OnboardingStackParamList } from '@/src/navigation/types';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuizProgressHeader } from './QuizProgressHeader';

const OPTIONS = [
    { id: 'Health', icon: '❤️', label: 'Improve my health', d: 'Fewer coughs, lower heart attack risk.' },
    { id: 'Money', icon: '💰', label: 'Save money', d: 'Stop burning cash on nicotine.' },
    { id: 'Family', icon: '👨‍👩‍👧', label: 'For my family / kids', d: 'Be healthy and present for them.' },
    { id: 'Freedom', icon: '🦅', label: 'Reclaim my freedom', d: 'Stop planning life around cravings.' },
];

export default function QuizWhyScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { specificBenefit, setSpecificBenefit } = useOnboardingStore();

    const handleSelect = (id: string) => {
        setSpecificBenefit(id);
        setTimeout(() => {
            navigation.navigate('QuizTriggers');
        }, 200);
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-900 px-6 pt-4">
            <QuizProgressHeader currentStep={3} totalSteps={5} />

            <Animated.View entering={FadeInUp.duration(600)}>
                <Text
                    style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 28 }}
                    className="text-white mb-2"
                >
                    What is your "Why"?
                </Text>
                <Text className="text-base text-white/50 mb-8">
                    The biggest reason why you are taking this step today.
                </Text>
            </Animated.View>

            <View className="flex-1">
                {OPTIONS.map((opt, index) => {
                    const isSelected = specificBenefit === opt.id;
                    return (
                        <Animated.View
                            key={opt.id}
                            entering={FadeInRight.duration(500).delay(index * 100)}
                        >
                            <Pressable
                                onPress={() => handleSelect(opt.id)}
                                className={`flex-row items-center p-4 mb-3 rounded-2xl border ${isSelected
                                    ? 'border-emerald-500 bg-emerald-500/15'
                                    : 'border-white/10 bg-white/5'
                                    } active:opacity-80`}
                            >
                                <Text className="text-3xl mr-4">{opt.icon}</Text>
                                <View className="flex-1">
                                    <Text className={`text-lg font-bold mb-0.5 ${isSelected ? 'text-emerald-400' : 'text-white'
                                        }`}>
                                        {opt.label}
                                    </Text>
                                    <Text className={`text-sm ${isSelected ? 'text-emerald-400/70' : 'text-white/40'}`}>{opt.d}</Text>
                                </View>
                            </Pressable>
                        </Animated.View>
                    );
                })}
            </View>
        </SafeAreaView>
    );
}
