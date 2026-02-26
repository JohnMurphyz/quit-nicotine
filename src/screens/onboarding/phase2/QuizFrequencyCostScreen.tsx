import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { CURRENCIES } from '@/src/constants/currencies';
import type { OnboardingStackParamList } from '@/src/navigation/types';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuizProgressHeader } from './QuizProgressHeader';

export default function QuizFrequencyCostScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { nicotineType, setCostAndFrequency, costPerUnit, unitsPerWeek, currency, setCurrency } = useOnboardingStore();

    const [costStr, setCostStr] = useState(costPerUnit ? costPerUnit.toString() : '');
    const [freqStr, setFreqStr] = useState(unitsPerWeek ? unitsPerWeek.toString() : '7');
    const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

    const selectedCurrency = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

    const unitLabel =
        nicotineType === 'vapes' ? 'vape/pod/juice' :
            nicotineType === 'cigarettes' ? 'pack' :
                nicotineType === 'pouches' ? 'tin' :
                    nicotineType === 'chewing' ? 'tin' :
                        'purchase'; // 'multiple' or fallback

    const freq = parseInt(freqStr, 10) || 0;

    const handleNext = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const cost = parseFloat(costStr) || 0;
        setCostAndFrequency(cost, freq);
        navigation.navigate('QuizWhy');
    };

    const handleCurrencySelect = (code: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCurrency(code);
        setShowCurrencyPicker(false);
    };

    const isValid = costStr.trim() && !isNaN(parseFloat(costStr)) && freq >= 1;

    return (
        <AnimatedSkyBackground>
            <SafeAreaView className="flex-1 px-6 pt-4">
                <QuizProgressHeader currentStep={2} totalSteps={5} />

                <Animated.View entering={FadeInUp.duration(500)}>
                    <Image
                        source={require('@/assets/images/quiz-spending-hero.png')}
                        style={{ width: '100%', height: 160, borderRadius: 16, opacity: 0.85 }}
                        resizeMode="cover"
                    />
                </Animated.View>

                <Animated.View entering={FadeInUp.duration(600)} style={{ marginTop: 16 }}>
                    <Text
                        style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 28 }}
                        className="text-white mb-2"
                    >
                        Your spending
                    </Text>
                    <Text className="text-base text-white/50 mb-8">
                        This powers your savings tracker — the more accurate, the better.
                    </Text>
                </Animated.View>

                <View className="flex-1">
                    <Animated.View entering={FadeInRight.duration(500).delay(100)} className="pt-2">
                        <Text className="text-white/70 font-bold mb-2 ml-1">How much is a {unitLabel}?</Text>
                        <View className="flex-row items-center bg-white/8 border border-white/10 rounded-2xl px-4 h-14">
                            <Pressable
                                onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
                                className="bg-white/10 rounded-xl px-3 py-1 mr-3"
                            >
                                <Text className="text-white font-bold text-sm">{selectedCurrency.code} ▾</Text>
                            </Pressable>
                            <Text className="text-xl text-white/40 mr-2">{selectedCurrency.symbol}</Text>
                            <TextInput
                                style={{ flex: 1, height: '100%', paddingHorizontal: 0, backgroundColor: 'transparent', color: '#fff', fontSize: 16 }}
                                placeholder="e.g. 15"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                keyboardType="decimal-pad"
                                value={costStr}
                                onChangeText={(t) => setCostStr(t.replace(/[^0-9.]/g, ''))}
                            />
                        </View>
                        {showCurrencyPicker && (
                            <Animated.View entering={FadeInUp.duration(300)} className="flex-row flex-wrap gap-2 mt-3">
                                {CURRENCIES.map((c) => {
                                    const isSelected = c.code === currency;
                                    return (
                                        <Pressable
                                            key={c.code}
                                            onPress={() => handleCurrencySelect(c.code)}
                                            className={`rounded-xl px-3 py-2 ${isSelected ? 'bg-emerald-500/20 border border-emerald-500' : 'bg-white/10 border border-white/10'}`}
                                        >
                                            <Text className={`font-bold text-sm ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                                                {c.symbol} {c.code}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </Animated.View>
                        )}
                    </Animated.View>

                    <Animated.View entering={FadeInRight.duration(500).delay(200)} className="mt-6">
                        <Text className="text-white/70 font-bold mb-2 ml-1">How many per week?</Text>
                        <View className="flex-row items-center bg-white/8 border border-white/10 rounded-2xl px-4 h-14">
                            <TextInput
                                style={{ flex: 1, height: '100%', paddingHorizontal: 0, backgroundColor: 'transparent', color: '#fff', fontSize: 16 }}
                                placeholder="e.g. 7"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                keyboardType="number-pad"
                                value={freqStr}
                                onChangeText={(t) => setFreqStr(t.replace(/[^0-9]/g, ''))}
                            />
                        </View>
                    </Animated.View>

                    {isValid && (
                        <Animated.View entering={FadeInRight.duration(400).delay(100)} className="mt-4">
                            <Text className="text-sm text-white/40 px-1">
                                ≈ {selectedCurrency.symbol}{((parseFloat(costStr) * freq) / 7).toFixed(2)}/day in savings when you quit
                            </Text>
                        </Animated.View>
                    )}
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
        </AnimatedSkyBackground>
    );
}
