import ForestGoldenSvg from '@/assets/images/scene-forest-golden.svg';
import type { OnboardingStackParamList } from '@/src/navigation/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Background() {
    return (
        <View style={StyleSheet.absoluteFill} className="bg-black">
            <View style={StyleSheet.absoluteFill}>
                <ForestGoldenSvg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
            </View>
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.85)']}
                locations={[0.2, 0.5, 1]}
                style={StyleSheet.absoluteFill}
            />
        </View>
    );
}

const WALKTHROUGH_SCREENS = ['WalkthroughDrug', 'WalkthroughRecovery', 'WalkthroughFeatures'] as const;

function PagerDots({ activeIndex, navigation }: { activeIndex: number, navigation: NativeStackNavigationProp<OnboardingStackParamList> }) {
    return (
        <View className="flex-row justify-center py-5">
            {WALKTHROUGH_SCREENS.map((screen, i) => (
                <Pressable
                    key={i}
                    onPress={() => {
                        if (i < activeIndex) navigation.navigate(screen);
                        else if (i > activeIndex) navigation.navigate(screen);
                    }}
                    hitSlop={12}
                >
                    <View
                        style={{ width: i === activeIndex ? 10 : 8, height: i === activeIndex ? 10 : 8, borderRadius: 5, marginHorizontal: 5, backgroundColor: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.3)' }}
                    />
                </Pressable>
            ))}
        </View>
    );
}

export default function WalkthroughRecoveryScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-black">
            <Background />

            {/* Floating brand mark */}
            <View style={{ paddingTop: insets.top + 12 }} className="absolute top-0 w-full flex-row justify-center items-center z-10">
                <Text style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 20, letterSpacing: 2, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 8 }} className="text-white/80">
                    FREED
                </Text>
            </View>

            <View className="flex-1 justify-end px-6" style={{ paddingBottom: insets.bottom + 16 }}>
                {/* Heading */}
                <Text
                    style={{ fontSize: 36, fontFamily: 'AbrilFatface_400Regular', letterSpacing: 1, textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 12 }}
                    className="text-white text-center mb-6"
                >
                    Path to Recovery
                </Text>

                {/* Glass card */}
                <BlurView intensity={20} tint="light" className="rounded-3xl p-6 overflow-hidden" style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' }}>
                    <Text className="text-base text-white/90 text-center leading-7 mb-2">
                        Recovery is possible. By <Text className="font-semibold text-white">abstaining from nicotine</Text>, your brain can <Text className="font-semibold text-white">reset its dopamine sensitivity</Text>, leading to healthier relationships and <Text className="font-semibold text-white">improved well-being</Text>.
                    </Text>
                </BlurView>

                {/* Dots below card */}
                <PagerDots activeIndex={1} navigation={navigation} />

                {/* CTA */}
                <Pressable
                    onPress={() => navigation.navigate('WalkthroughFeatures')}
                    className="w-full bg-white h-14 rounded-2xl items-center justify-center flex-row shadow-lg active:opacity-80"
                >
                    <Text className="text-black text-lg font-bold mr-2">Next</Text>
                    <Ionicons name="chevron-forward" size={20} color="black" />
                </Pressable>
            </View>
        </View>
    );
}
