import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface Props {
    currentStep: number;
    totalSteps: number;
}

export function QuizProgressHeader({ currentStep, totalSteps }: Props) {
    const navigation = useNavigation();
    const progress = currentStep / totalSteps;

    const barStyle = useAnimatedStyle(() => {
        return {
            width: withTiming(`${progress * 100}%`, { duration: 400 }),
        };
    });

    return (
        <View className="flex-row items-center w-full mb-6">
            <Pressable
                onPress={() => navigation.goBack()}
                className="mr-3 w-8 h-8 items-center justify-center"
            >
                <Ionicons name="arrow-back" size={24} color="rgba(255,255,255,0.6)" />
            </Pressable>

            <View className="flex-1 h-[3px] bg-white/10 rounded-full overflow-hidden">
                <Animated.View
                    className="h-full bg-emerald-500 rounded-full"
                    style={barStyle}
                />
            </View>

            <Text className="ml-3 text-xs text-white/40">
                {currentStep} of {totalSteps}
            </Text>
        </View>
    );
}
