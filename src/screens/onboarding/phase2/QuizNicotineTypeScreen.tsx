import type { OnboardingStackParamList } from '@/src/navigation/types';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import type { NicotineType } from '@/src/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuizProgressHeader } from './QuizProgressHeader';

const OPTIONS: { id: NicotineType; label: string; icon: string }[] = [
    { id: 'vapes', label: 'Vapes / E-Cigs', icon: '💨' },
    { id: 'cigarettes', label: 'Cigarettes', icon: '🚬' },
    { id: 'pouches', label: 'Nicotine Pouches', icon: '⚪' },
    { id: 'chewing', label: 'Chewing Tobacco', icon: '🤠' },
];

export default function QuizNicotineTypeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { setNicotineType, nicotineType } = useOnboardingStore();

    const handleSelect = (id: NicotineType) => {
        setNicotineType(id);
        setTimeout(() => {
            navigation.navigate('QuizFrequencyCost');
        }, 200);
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-900 px-6 pt-4">
            <QuizProgressHeader currentStep={1} totalSteps={5} />

            <Animated.View entering={FadeInUp.duration(600)}>
                <Text
                    style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 28 }}
                    className="text-white mb-2"
                >
                    What are you quitting?
                </Text>
                <Text className="text-base text-white/50 mb-8">
                    This helps us personalize your recovery milestones.
                </Text>
            </Animated.View>

            <View className="flex-1">
                {OPTIONS.map((opt, index) => {
                    const isSelected = nicotineType === opt.id;
                    return (
                        <Animated.View
                            key={opt.id}
                            entering={FadeInRight.duration(500).delay(index * 100)}
                        >
                            <Pressable
                                onPress={() => handleSelect(opt.id)}
                                className={`flex-row items-center p-5 mb-3 rounded-2xl border ${isSelected
                                    ? 'border-emerald-500 bg-emerald-500/15'
                                    : 'border-white/10 bg-white/5'
                                    } active:opacity-80`}
                            >
                                <Text className="text-3xl mr-4">{opt.icon}</Text>
                                <Text className={`text-lg font-bold ${isSelected ? 'text-emerald-400' : 'text-white'
                                    }`}>
                                    {opt.label}
                                </Text>
                            </Pressable>
                        </Animated.View>
                    );
                })}
            </View>
        </SafeAreaView>
    );
}
