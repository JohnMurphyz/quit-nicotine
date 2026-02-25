import MountainDawnSvg from '@/assets/images/scene-mountain-dawn.svg';
import type { OnboardingStackParamList } from '@/src/navigation/types';
import { useAuthStore } from '@/src/stores/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
    Easing,
    FadeIn,
    FadeInDown,
    FadeInUp,
    FadeOut,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BACKDROP_HEIGHT = SCREEN_HEIGHT * 0.55;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

function AnimatedBackground() {
    const scale = useSharedValue(1.15);
    const translateX = useSharedValue(0);

    useEffect(() => {
        scale.value = withSequence(
            withTiming(1.0, { duration: 4000, easing: Easing.out(Easing.ease) }),
            withTiming(1.05, { duration: 25000, easing: Easing.inOut(Easing.ease) })
        );
        translateX.value = withSequence(
            withTiming(0, { duration: 4000 }),
            withTiming(-15, { duration: 25000, easing: Easing.inOut(Easing.ease) })
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateX: translateX.value }
        ]
    }));

    return (
        <View style={StyleSheet.absoluteFill} className="bg-black">
            <Animated.View
                entering={FadeIn.duration(1500)}
                style={[StyleSheet.absoluteFill, animatedStyle]}
            >
                <MountainDawnSvg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
            </Animated.View>

            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.65)']}
                locations={[0.35, 1]}
                style={StyleSheet.absoluteFill}
            />
        </View>
    );
}

/* ─── Sign-In Provider Button ─── */
function ProviderButton({
    icon,
    label,
    onPress,
    variant = 'filled',
}: {
    icon?: React.ReactNode;
    label: string;
    onPress: () => void;
    variant?: 'filled' | 'outline';
}) {
    const isFilled = variant === 'filled';
    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.providerButton,
                isFilled
                    ? styles.providerButtonFilled
                    : styles.providerButtonOutline,
            ]}
        >
            <View style={styles.providerInner}>
                <View style={styles.providerIcon}>{icon ?? <View style={{ width: 24 }} />}</View>
                <Text
                    style={[
                        styles.providerLabel,
                        isFilled
                            ? styles.providerLabelFilled
                            : styles.providerLabelOutline,
                    ]}
                >
                    {label}
                </Text>
            </View>
        </Pressable>
    );
}

/* ─── Inline Email Sign-In Form ─── */
function EmailSignInForm({ onBack }: { onBack: () => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const signIn = useAuthStore((s) => s.signIn);
    const isValid = email.trim() && password.trim();

    const handleSignIn = async () => {
        if (!isValid) {
            Alert.alert('Missing fields', 'Please enter both email and password.');
            return;
        }
        setLoading(true);
        try {
            await signIn(email.trim(), password);
        } catch (e: any) {
            Alert.alert('Sign In Failed', e.message ?? 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                {/* Back row */}
                <Pressable onPress={onBack} hitSlop={12} style={{ marginBottom: 16 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
                        ← Back to options
                    </Text>
                </Pressable>

                {/* Email */}
                <View style={{ marginBottom: 12 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600', marginBottom: 6, marginLeft: 2 }}>Email</Text>
                    <TextInput
                        style={styles.textInput}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        placeholderTextColor="rgba(255,255,255,0.25)"
                        placeholder="you@email.com"
                    />
                </View>

                {/* Password */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600', marginBottom: 6, marginLeft: 2 }}>Password</Text>
                    <TextInput
                        style={styles.textInput}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoComplete="password"
                        placeholderTextColor="rgba(255,255,255,0.25)"
                        placeholder="••••••••"
                    />
                </View>

                {/* Submit */}
                <Pressable
                    onPress={handleSignIn}
                    disabled={!isValid || loading}
                    style={[
                        styles.providerButton,
                        styles.providerButtonFilled,
                        (!isValid || loading) && { opacity: 0.35 },
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={[styles.providerLabel, styles.providerLabelFilled]}>
                            Sign In
                        </Text>
                    )}
                </Pressable>
            </KeyboardAvoidingView>
        </Animated.View>
    );
}

/* ─── Sign-In Overlay ─── */
function SignInOverlay({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const insets = useSafeAreaInsets();
    const [overlayState, setOverlayState] = useState<'providers' | 'email' | 'noAccount'>('providers');
    const { signInWithApple, signInWithGoogle, fetchProfile, signOut, profile } = useAuthStore();
    const translateY = useSharedValue(BACKDROP_HEIGHT);

    useEffect(() => {
        translateY.value = withTiming(visible ? 0 : BACKDROP_HEIGHT, {
            duration: 450,
            easing: Easing.inOut(Easing.ease),
        });
    }, [visible]);

    const handleClose = useCallback(() => {
        setOverlayState('providers');
        translateY.value = withTiming(BACKDROP_HEIGHT, {
            duration: 450,
            easing: Easing.inOut(Easing.ease),
        });
        setTimeout(onClose, 450);
    }, [onClose]);

    const handleOAuthSignIn = useCallback(async (method: 'apple' | 'google') => {
        try {
            if (method === 'apple') {
                await signInWithApple();
            } else {
                await signInWithGoogle();
            }
            // Check if a profile exists for this user
            await fetchProfile();
            const currentProfile = useAuthStore.getState().profile;
            if (!currentProfile) {
                // No account found — sign out and show message
                await signOut();
                setOverlayState('noAccount');
            }
        } catch (e: any) {
            // Silently ignore user cancellations
            if (e.code === 'ERR_REQUEST_CANCELED') return;
            // For Google sign-in errors (e.g. nonce mismatch) or any other
            // auth failures, show the friendly "no account" screen instead
            // of a raw technical error alert.
            setOverlayState('noAccount');
        }
    }, [signInWithApple, signInWithGoogle, fetchProfile, signOut]);

    const backdropStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    if (!visible) return null;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            {/* Tap-to-dismiss zone (top half, transparent) */}
            <Pressable
                onPress={handleClose}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45%' }}
            />

            {/* Gradient backdrop — slides up from bottom */}
            <AnimatedLinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)', '#000']}
                locations={[0, 0.3, 0.55]}
                style={[{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: BACKDROP_HEIGHT,
                }, backdropStyle]}
                pointerEvents="none"
            />

            {/* Bottom panel — slides with the backdrop */}
            <Animated.View
                style={[styles.panel, { paddingBottom: insets.bottom + 20 }, backdropStyle]}
            >
                {overlayState === 'providers' && (
                    <>
                        <ProviderButton
                            icon={<Ionicons name="logo-apple" size={20} color="#000" />}
                            label="Continue with Apple"
                            onPress={() => handleOAuthSignIn('apple')}
                        />

                        <ProviderButton
                            icon={<Ionicons name="logo-google" size={18} color="#000" />}
                            label="Continue with Google"
                            onPress={() => handleOAuthSignIn('google')}
                        />

                        <ProviderButton
                            icon={<Ionicons name="mail-outline" size={18} color="rgba(255,255,255,0.85)" />}
                            label="Continue with email"
                            onPress={() => setOverlayState('email')}
                            variant="outline"
                        />

                    </>
                )}

                {overlayState === 'email' && (
                    <EmailSignInForm onBack={() => setOverlayState('providers')} />
                )}

                {overlayState === 'noAccount' && (
                    <Animated.View entering={FadeIn.duration(300)}>
                        <View style={{ alignItems: 'center', paddingVertical: 8 }}>
                            <Ionicons name="person-outline" size={36} color="rgba(255,255,255,0.4)" style={{ marginBottom: 16 }} />
                            <Text
                                style={{
                                    fontFamily: 'AbrilFatface_400Regular',
                                    fontSize: 22,
                                    color: '#fff',
                                    textAlign: 'center',
                                    marginBottom: 10,
                                }}
                            >
                                No account found
                            </Text>
                            <Text
                                style={{
                                    fontSize: 15,
                                    color: 'rgba(255,255,255,0.55)',
                                    textAlign: 'center',
                                    lineHeight: 22,
                                    paddingHorizontal: 12,
                                    marginBottom: 24,
                                }}
                            >
                                We couldn't find an account linked to this sign-in. Try another method, or begin your journey to create one.
                            </Text>

                            <ProviderButton
                                icon={<Ionicons name="arrow-back" size={18} color="#000" />}
                                label="Try another method"
                                onPress={() => setOverlayState('providers')}
                            />

                            <Pressable
                                onPress={() => {
                                    handleClose();
                                    navigation.navigate('WalkthroughDrug');
                                }}
                                style={[styles.providerButton, styles.providerButtonOutline]}
                            >
                                <View style={styles.providerInner}>
                                    <View style={styles.providerIcon}>
                                        <Ionicons name="compass-outline" size={18} color="rgba(255,255,255,0.85)" />
                                    </View>
                                    <Text style={[styles.providerLabel, styles.providerLabelOutline]}>
                                        Begin Journey
                                    </Text>
                                </View>
                            </Pressable>
                        </View>
                    </Animated.View>
                )}
            </Animated.View>
        </View>
    );
}

/* ─── Main Screen ─── */
export default function WelcomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const insets = useSafeAreaInsets();
    const [signInExpanded, setSignInExpanded] = useState(false);

    return (
        <View className="flex-1 bg-black">
            <AnimatedBackground />

            {/* Centered hero content */}
            <View className="flex-1 items-center justify-center px-8">
                <Animated.View entering={FadeIn.duration(1200).delay(1800)} className="items-center">
                    <Text
                        style={{ fontSize: 56, fontFamily: 'AbrilFatface_400Regular', letterSpacing: 4, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 12 }}
                        className="text-white text-center"
                    >
                        FREED
                    </Text>
                    <Animated.View entering={FadeInDown.duration(800).delay(2300)}>
                        <Text className="text-white/90 text-lg text-center mt-4 leading-7 px-4">
                            A science-backed plan to crush cravings{'\n'}and reclaim your freedom from nicotine.
                        </Text>
                    </Animated.View>
                </Animated.View>
            </View>

            {/* Bottom CTA */}
            <Animated.View
                entering={FadeInUp.duration(800).delay(2800)}
                style={{ paddingBottom: insets.bottom + 16 }}
                className="px-6"
            >
                <Pressable
                    onPress={() => navigation.navigate('WalkthroughDrug')}
                    className="w-full bg-white h-14 rounded-2xl items-center justify-center shadow-lg active:opacity-80"
                >
                    <Text className="text-black text-lg font-bold">Begin Journey</Text>
                </Pressable>

                <Animated.View entering={FadeInUp.duration(600).delay(3000)} className="mt-4 items-center">
                    <Pressable onPress={() => setSignInExpanded(true)} hitSlop={8}>
                        <Text className="text-white/50 text-sm">
                            Already have an account? <Text className="font-bold">Sign In</Text>
                        </Text>
                    </Pressable>
                </Animated.View>
            </Animated.View>

            {/* Animated sign-in overlay */}
            <SignInOverlay visible={signInExpanded} onClose={() => setSignInExpanded(false)} />
        </View>
    );
}

/* ─── Styles ─── */
const styles = StyleSheet.create({
    panel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingTop: 28,
    },
    providerButton: {
        width: '100%',
        height: 54,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    providerButtonFilled: {
        backgroundColor: '#fff',
    },
    providerButtonOutline: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
    },
    providerInner: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 220,
    },
    providerIcon: {
        width: 24,
        alignItems: 'center',
        marginRight: 10,
    },
    providerLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    providerLabelFilled: {
        color: '#000',
    },
    providerLabelOutline: {
        color: 'rgba(255,255,255,0.85)',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    footerLink: {
        color: 'rgba(255,255,255,0.35)',
        fontSize: 13,
    },
    footerDot: {
        color: 'rgba(255,255,255,0.2)',
        marginHorizontal: 8,
        fontSize: 13,
    },
    textInput: {
        fontSize: 16,
        color: '#fff',
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
    },
});
