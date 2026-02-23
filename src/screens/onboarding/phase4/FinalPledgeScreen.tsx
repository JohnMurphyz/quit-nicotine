import type { AppStackParamList } from '@/src/navigation/types';
import { useAuthStore } from '@/src/stores/authStore';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

function SignatureGraphic() {
    return (
        <AnimatedSvg
            width={140}
            height={140}
            viewBox="0 0 100 100"
            entering={FadeInUp.duration(600).delay(300)}
            className="mb-6 opacity-30"
        >
            <Path
                d="M10,80 Q30,50 50,70 T90,40"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <Path
                d="M20,60 Q40,30 60,60 T95,50"
                fill="none"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </AnimatedSvg>
    );
}

export default function FinalPledgeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
    const { specificBenefit } = useOnboardingStore();
    const { user, updateProfile } = useAuthStore();
    const [submitting, setSubmitting] = useState(false);

    const handleComplete = async () => {
        if (!user) return;
        setSubmitting(true);
        try {
            await updateProfile({ onboarding_completed: true });
        } catch (e) {
            console.error('Failed to complete onboarding:', e);
            setSubmitting(false);
        }
    };

    const benefitMap: Record<string, string> = {
        'Health': 'protect my health and lower my heart attack risk',
        'Money': 'stop burning my hard-earned cash',
        'Family': 'be healthy and present for my family',
        'Freedom': 'reclaim my freedom from cravings',
    };
    const reasonText = specificBenefit && benefitMap[specificBenefit] ? benefitMap[specificBenefit] : 'reclaim my life';

    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <SafeAreaView className="flex-1 bg-dark-900 justify-between px-6 pt-12 pb-8">
            <View className="flex-1 items-center justify-center">
                <SignatureGraphic />

                <Animated.View entering={FadeInUp.duration(800).delay(600)} className="w-full">
                    <Text
                        style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 36 }}
                        className="text-white text-center mb-6"
                    >
                        The Pledge
                    </Text>

                    <View className="bg-white/8 rounded-2xl p-6 border border-white/10 w-full mb-8">
                        <Text
                            style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 18, lineHeight: 30 }}
                            className="text-white/80 text-center"
                        >
                            "I, <Text className="text-white font-bold">{user?.user_metadata?.first_name || 'My Name'}</Text>, promise myself that starting today, I am committing to this journey.
                            {'\n\n'}
                            I am doing this to <Text className="text-emerald-400 font-bold">{reasonText}</Text>.
                            {'\n\n'}
                            I will forgive myself for setbacks, but I will never give up."
                        </Text>
                    </View>

                    <Text className="text-white/30 text-center text-sm uppercase tracking-widest">
                        {dateStr}
                    </Text>
                </Animated.View>
            </View>

            <Animated.View entering={FadeInUp.duration(600).delay(1500)} className="w-full">
                <Pressable
                    onPress={handleComplete}
                    disabled={submitting}
                    className={`w-full h-14 rounded-2xl items-center justify-center shadow-lg ${submitting ? 'bg-white/20' : 'bg-white active:opacity-80'}`}
                >
                    <Text className={`text-lg font-bold ${submitting ? 'text-white/40' : 'text-black'}`}>
                        {submitting ? 'Signing...' : 'Sign & Begin Journey'}
                    </Text>
                </Pressable>
            </Animated.View>
        </SafeAreaView>
    );
}
