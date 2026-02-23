import { Input } from '@/src/components/ui/Input';
import type { OnboardingStackParamList } from '@/src/navigation/types';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuizProgressHeader } from './QuizProgressHeader';

export default function QuizFrequencyCostScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { nicotineType, setCostAndQuitDate, dailyCost, quitDate } = useOnboardingStore();

    const [costStr, setCostStr] = useState(dailyCost ? dailyCost.toString() : '');

    const labelPrefix = nicotineType === 'vapes' ? 'pod/juice' :
        nicotineType === 'pouches' ? 'tin' :
            nicotineType === 'chewing' ? 'tin' : 'pack';

    const handleNext = () => {
        setCostAndQuitDate(parseFloat(costStr) || 0, quitDate || '');
        navigation.navigate('QuizWhy');
    };

    const isValid = costStr.trim() && !isNaN(parseFloat(costStr));

    return (
        <SafeAreaView className="flex-1 bg-dark-900 px-6 pt-4">
            <QuizProgressHeader currentStep={2} totalSteps={5} />

            <Animated.View entering={FadeInUp.duration(600)}>
                <Text
                    style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 28 }}
                    className="text-white mb-2"
                >
                    What's the damage?
                </Text>
                <Text className="text-base text-white/50 mb-8">
                    We use this to track how much money you save by quitting.
                </Text>
            </Animated.View>

            <View className="flex-1">
                <Animated.View entering={FadeInRight.duration(500).delay(100)} className="pt-2">
                    <Text className="text-white/70 font-bold mb-2 ml-1">How much is a {labelPrefix}?</Text>
                    <View className="flex-row items-center bg-white/8 border border-white/10 rounded-2xl px-4 h-14">
                        <Text className="text-xl text-white/40 mr-2">$</Text>
                        <Input
                            style={{ flex: 1, borderWidth: 0, height: '100%', paddingHorizontal: 0, backgroundColor: 'transparent', color: '#fff' }}
                            placeholder="e.g. 15"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            keyboardType="decimal-pad"
                            value={costStr}
                            onChangeText={setCostStr}
                        />
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInRight.duration(500).delay(200)}>
                    <Text className="text-sm text-white/40 mt-2 px-1">
                        * We'll assume roughly 1 {labelPrefix} every 1-2 days for your savings calculator.
                    </Text>
                </Animated.View>
            </View>

            <Animated.View entering={FadeInUp.duration(600).delay(400)} className="w-full pb-8">
                <Pressable
                    onPress={handleNext}
                    disabled={!isValid}
                    className={`w-full h-14 rounded-2xl items-center justify-center ${isValid ? 'bg-white active:opacity-80' : 'bg-white/20'}`}
                >
                    <Text className={`text-lg font-bold ${isValid ? 'text-black' : 'text-white/40'}`}>Next</Text>
                </Pressable>
            </Animated.View>
        </SafeAreaView>
    );
}
