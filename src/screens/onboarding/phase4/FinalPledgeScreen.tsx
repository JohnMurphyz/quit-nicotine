import SignaturePad from '@/src/components/SignaturePad';
import type { OnboardingStackParamList } from '@/src/navigation/types';
import { useAuthStore } from '@/src/stores/authStore';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const NICOTINE_LABELS: Record<string, string> = {
    cigarettes: 'smoking',
    vapes: 'vaping',
    pouches: 'pouches',
    chewing: 'chewing tobacco',
    multiple: 'nicotine',
};

const BENEFIT_MAP: Record<string, string> = {
    Health: 'my health',
    Money: 'my money',
    Family: 'my family',
    Freedom: 'my freedom',
    Fitness: 'my fitness',
    MentalClarity: 'my clarity',
};

export default function FinalPledgeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { nicotineType, specificBenefit } = useOnboardingStore();
    const { user, profile } = useAuthStore();
    const [hasSigned, setHasSigned] = useState(false);

    const firstName =
        profile?.display_name?.split(' ')[0] ||
        user?.user_metadata?.display_name?.split(' ')[0] ||
        null;
    const nicotineLabel = NICOTINE_LABELS[nicotineType ?? ''] ?? 'nicotine';
    const reasonText = specificBenefit && BENEFIT_MAP[specificBenefit] ? BENEFIT_MAP[specificBenefit] : 'my life';

    return (
        <SafeAreaView className="flex-1 bg-dark-900 px-6 pt-8 pb-8 justify-between">
            <View className="items-center">
                <Animated.View
                    entering={FadeInUp.duration(600).delay(300)}
                    className="mb-4 w-14 h-14 rounded-full bg-emerald-500/15 items-center justify-center"
                >
                    <Ionicons name="shield-checkmark-outline" size={34} color="#34d399" />
                </Animated.View>

                <Animated.View entering={FadeInUp.duration(800).delay(600)} className="w-full">
                    <Text
                        style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 32 }}
                        className="text-white text-center mb-5"
                    >
                        My commitment
                    </Text>

                    <View className="bg-white/8 rounded-2xl p-5 border border-white/10 w-full">
                        <Text style={{ fontSize: 17, lineHeight: 28 }} className="text-white/80 text-center">
                            {firstName ? (
                                <>I, <Text className="text-white font-bold">{firstName}</Text>, am</>
                            ) : (
                                <>I am</>
                            )}{' '}
                            choosing to quit <Text className="text-white font-bold">{nicotineLabel}</Text> for{' '}
                            <Text className="text-emerald-400 font-bold">{reasonText}</Text>.
                            {'\n\n'}
                            When hard days come, I'll use my tools instead of giving in.
                            {'\n\n'}
                            One day at a time. This is my decision.
                        </Text>

                        <View className="h-px bg-white/10 my-4" />

                        <SignaturePad onSignatureChange={setHasSigned} height={120} />
                    </View>
                </Animated.View>
            </View>

            <Animated.View entering={FadeInUp.duration(600).delay(1500)} className="w-full">
                <Pressable
                    onPress={() => navigation.navigate('PaywallTrialIntro')}
                    disabled={!hasSigned}
                    className={`w-full h-14 rounded-2xl items-center justify-center shadow-lg ${
                        hasSigned ? 'bg-white active:opacity-80' : 'bg-white/20'
                    }`}
                >
                    <Text className={`text-lg font-bold ${hasSigned ? 'text-black' : 'text-white/40'}`}>
                        I'm ready
                    </Text>
                </Pressable>
            </Animated.View>
        </SafeAreaView>
    );
}
