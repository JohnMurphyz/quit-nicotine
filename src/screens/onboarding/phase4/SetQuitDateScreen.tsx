import type { OnboardingStackParamList } from '@/src/navigation/types';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const OPTIONS = [
    { label: 'Quit Today', description: 'Start your timer right now.', daysFromNow: 0, primary: true },
    { label: 'Tomorrow', description: 'One night to prepare.', daysFromNow: 1, primary: false },
    { label: 'In 3 Days', description: 'A few days to get ready.', daysFromNow: 3, primary: false },
    { label: 'In 7 Days', description: 'Take a full week to prepare.', daysFromNow: 7, primary: false },
];

export default function SetQuitDateScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { setCostAndQuitDate, dailyCost } = useOnboardingStore();

    const handleSelect = (daysFromNow: number) => {
        const d = new Date();
        d.setDate(d.getDate() + daysFromNow);
        setCostAndQuitDate(dailyCost || 0, d.toISOString());
        navigation.navigate('FinalPledge');
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-900 px-6 pt-10 pb-8 items-center justify-between">
            <View className="flex-1 items-center w-full mt-10">
                <Animated.View
                    entering={FadeInUp.duration(600)}
                    className="mb-8 w-20 h-20 rounded-full bg-emerald-500/15 items-center justify-center"
                >
                    <Ionicons name="calendar-outline" size={48} color="#34d399" />
                </Animated.View>

                <Animated.View entering={FadeInUp.duration(600).delay(200)} className="w-full mb-10 items-center">
                    <Text
                        style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 32 }}
                        className="text-white text-center"
                    >
                        Your Quit Date
                    </Text>
                    <Text className="text-base text-white/50 text-center mt-3 px-4 leading-relaxed">
                        There's never a "perfect" time. But the sooner you start, the sooner you're free.
                    </Text>
                </Animated.View>

                <View className="w-full">
                    {OPTIONS.map((opt, index) => (
                        <Animated.View key={opt.label} entering={FadeInRight.duration(500).delay(400 + index * 100)}>
                            <Pressable
                                onPress={() => handleSelect(opt.daysFromNow)}
                                className={`p-5 rounded-2xl w-full mb-3 items-center active:opacity-80 ${
                                    opt.primary
                                        ? 'bg-emerald-500'
                                        : 'bg-white/5 border border-white/10'
                                }`}
                            >
                                <Text className={`text-xl font-bold mb-1 ${opt.primary ? 'text-white' : 'text-white'}`}>
                                    {opt.label}
                                </Text>
                                <Text className={`text-sm ${opt.primary ? 'text-emerald-100/70' : 'text-white/40'}`}>
                                    {opt.description}
                                </Text>
                            </Pressable>
                        </Animated.View>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
}
