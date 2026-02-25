import type { OnboardingStackParamList } from '@/src/navigation/types';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import type { NicotineType } from '@/src/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
    FadeIn,
    FadeInRight,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuizProgressHeader } from './QuizProgressHeader';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const OPTIONS: { id: NicotineType; label: string; icon: string }[] = [
    { id: 'vapes', label: 'Vapes / E-Cigs', icon: '💨' },
    { id: 'cigarettes', label: 'Cigarettes', icon: '🚬' },
    { id: 'pouches', label: 'Nicotine Pouches / Snus', icon: '🇸🇪' },
    { id: 'chewing', label: 'Chewing Tobacco', icon: '🤠' },
    { id: 'multiple', label: 'Multiple Types', icon: '🔄' },
];

function OptionCard({ opt, index, isSelected, onSelect }: {
    opt: typeof OPTIONS[number];
    index: number;
    isSelected: boolean;
    onSelect: (id: NicotineType) => void;
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
                <Text className={`text-lg font-bold flex-1 ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                    {opt.label}
                </Text>
                {isSelected && (
                    <Animated.View entering={FadeIn.duration(200)}>
                        <Ionicons name="checkmark-circle" size={22} color="#34d399" />
                    </Animated.View>
                )}
            </AnimatedPressable>
        </Animated.View>
    );
}

export default function QuizNicotineTypeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { setNicotineType, nicotineType } = useOnboardingStore();

    const handleSelect = (id: NicotineType) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
                {OPTIONS.map((opt, index) => (
                    <OptionCard
                        key={opt.id}
                        opt={opt}
                        index={index}
                        isSelected={nicotineType === opt.id}
                        onSelect={handleSelect}
                    />
                ))}
            </View>
        </SafeAreaView>
    );
}
