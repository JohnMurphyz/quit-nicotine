import type { OnboardingStackParamList } from '@/src/navigation/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Linking, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'PaymentFailed'>;

export default function PaymentFailedScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const route = useRoute<Props['route']>();
    const errorMessage = route.params?.message;

    return (
        <View className="flex-1 bg-[#0f0d2e]">
            <SafeAreaView className="flex-1 px-6" edges={['top', 'bottom']}>
                {/* Close button */}
                <Animated.View entering={FadeIn.duration(400)} className="items-end pt-4">
                    <Pressable
                        onPress={() => navigation.navigate('Paywall')}
                        className="w-10 h-10 rounded-full bg-white/10 items-center justify-center active:opacity-60"
                    >
                        <Ionicons name="close" size={20} color="rgba(255,255,255,0.7)" />
                    </Pressable>
                </Animated.View>

                {/* Icon */}
                <Animated.View entering={FadeInDown.duration(600).delay(100)} className="items-center mt-12 mb-8">
                    <View
                        className="w-24 h-24 rounded-full items-center justify-center"
                        style={{
                            backgroundColor: 'rgba(239,68,68,0.12)',
                            borderWidth: 1,
                            borderColor: 'rgba(239,68,68,0.3)',
                            shadowColor: '#ef4444',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.35,
                            shadowRadius: 20,
                        }}
                    >
                        <Ionicons name="close-circle-outline" size={52} color="#f87171" />
                    </View>
                </Animated.View>

                {/* Headline */}
                <Animated.View entering={FadeInUp.duration(600).delay(200)} className="items-center mb-3">
                    <Text
                        style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 28 }}
                        className="text-white text-center"
                    >
                        {"Payment didn't\ngo through"}
                    </Text>
                </Animated.View>

                {/* Body */}
                <Animated.View entering={FadeInUp.duration(600).delay(300)} className="items-center mb-4">
                    <Text className="text-white/55 text-base leading-relaxed text-center">
                        No charge was made to your card. Check your payment details and try again.
                    </Text>
                </Animated.View>

                {/* Error detail card */}
                {errorMessage && (
                    <Animated.View entering={FadeInUp.duration(600).delay(380)} className="mb-4">
                        <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
                            <View
                                className="flex-row items-start gap-3 px-4 py-3"
                                style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
                            >
                                <Ionicons name="warning-outline" size={16} color="#f87171" style={{ marginTop: 1 }} />
                                <Text className="text-red-300/80 text-sm leading-relaxed flex-1">
                                    {errorMessage}
                                </Text>
                            </View>
                        </BlurView>
                    </Animated.View>
                )}

                {/* Common reasons */}
                <Animated.View entering={FadeInUp.duration(600).delay(400)} className="mb-6">
                    <BlurView intensity={18} tint="light" className="rounded-2xl overflow-hidden">
                        <View style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                            {[
                                { icon: 'card-outline', text: 'Card declined or expired' },
                                { icon: 'wifi-outline', text: 'Network issue during checkout' },
                                { icon: 'lock-closed-outline', text: 'Bank blocked the transaction' },
                            ].map((item, i, arr) => (
                                <View key={item.text}>
                                    <View className="flex-row items-center gap-3 px-4 py-3">
                                        <Ionicons name={item.icon as any} size={16} color="rgba(255,255,255,0.35)" />
                                        <Text className="text-white/50 text-sm">{item.text}</Text>
                                    </View>
                                    {i < arr.length - 1 && (
                                        <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginHorizontal: 16 }} />
                                    )}
                                </View>
                            ))}
                        </View>
                    </BlurView>
                </Animated.View>

                <View className="flex-1" />

                {/* CTAs */}
                <Animated.View entering={FadeInUp.duration(600).delay(450)}>
                    {/* Primary — retry */}
                    <Pressable
                        onPress={() => navigation.navigate('Paywall')}
                        className="w-full h-14 rounded-2xl bg-emerald-500 items-center justify-center shadow-lg active:opacity-80 mb-3"
                    >
                        <Text className="text-white text-lg font-bold tracking-wider">Try again</Text>
                    </Pressable>

                    {/* Secondary — get help */}
                    <Pressable
                        onPress={() => Linking.openURL('mailto:support@quitnicotine.app?subject=Payment%20issue')}
                        className="w-full h-12 rounded-2xl items-center justify-center active:opacity-60 mb-2"
                    >
                        <Text className="text-white/45 text-sm">Get help from support</Text>
                    </Pressable>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}
