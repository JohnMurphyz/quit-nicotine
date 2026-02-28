import type { OnboardingStackParamList } from '@/src/navigation/types';
import { useAuthStore } from '@/src/stores/authStore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthCreationScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { signIn, signUp, signInWithApple, signInWithGoogle, loading } = useAuthStore();

    const DEV_EMAIL = 'test@quitnicotine.dev';
    const DEV_PASSWORD = 'testtest123';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleRegister = async () => {
        if (!email || !password || !name) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        try {
            await signUp(email, password, name);
            navigation.navigate('PaywallTrialIntro');
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Registration failed');
        }
    };

    const handleAppleSignIn = async () => {
        try {
            await signInWithApple();
            navigation.navigate('PaywallTrialIntro');
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Apple sign-in failed');
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            navigation.navigate('PaywallTrialIntro');
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Google sign-in failed');
        }
    };

    const handleDevSignIn = async () => {
        try {
            await signIn(DEV_EMAIL, DEV_PASSWORD);
            navigation.navigate('PaywallTrialIntro');
        } catch {
            try {
                await signUp(DEV_EMAIL, DEV_PASSWORD, 'Test User');
                navigation.navigate('PaywallTrialIntro');
            } catch (error: any) {
                Alert.alert('Dev Sign In Failed', error.message ?? 'Something went wrong.');
            }
        }
    };

    const isValid = email && password && name;

    return (
        <SafeAreaView className="flex-1 bg-dark-900 px-6 pt-10 pb-8">
            <KeyboardAvoidingView
                style={{ flex: 1, justifyContent: 'space-between' }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <Animated.View entering={FadeInUp.duration(600)}>
                    <Text
                        style={{ fontFamily: 'AbrilFatface_400Regular', fontSize: 32 }}
                        className="text-white mb-2"
                    >
                        Save your progress
                    </Text>
                    <Text className="text-base text-white/50 mb-8 leading-relaxed">
                        Create an account so your journey, streaks, and savings are never lost.
                    </Text>

                    {/* Social sign-in buttons */}
                    <Pressable
                        onPress={handleAppleSignIn}
                        disabled={loading}
                        className="w-full h-14 rounded-2xl items-center justify-center flex-row bg-white mb-3 active:opacity-80"
                    >
                        <Ionicons name="logo-apple" size={20} color="#000" style={{ marginRight: 8 }} />
                        <Text className="text-black text-base font-bold">Continue with Apple</Text>
                    </Pressable>

                    <Pressable
                        onPress={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full h-14 rounded-2xl items-center justify-center flex-row bg-white/10 border border-white/10 mb-6 active:opacity-80"
                    >
                        <Ionicons name="logo-google" size={18} color="#fff" style={{ marginRight: 8 }} />
                        <Text className="text-white text-base font-bold">Continue with Google</Text>
                    </Pressable>

                    {/* Divider */}
                    <View className="flex-row items-center mb-6">
                        <View className="flex-1 h-px bg-white/10" />
                        <Text className="text-white/30 mx-4 text-sm">or</Text>
                        <View className="flex-1 h-px bg-white/10" />
                    </View>

                    {/* Email form */}
                    <View className="mb-4">
                        <Text className="text-white/70 font-bold mb-2 ml-1">First Name</Text>
                        <View className="bg-white/8 border border-white/10 rounded-2xl px-4 h-14 justify-center">
                            <TextInput
                                style={{ height: '100%', backgroundColor: 'transparent', color: '#fff', fontSize: 16 }}
                                placeholder="e.g. Alex"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-white/70 font-bold mb-2 ml-1">Email Address</Text>
                        <View className="bg-white/8 border border-white/10 rounded-2xl px-4 h-14 justify-center">
                            <TextInput
                                style={{ height: '100%', backgroundColor: 'transparent', color: '#fff', fontSize: 16 }}
                                placeholder="you@email.com"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-white/70 font-bold mb-2 ml-1">Password</Text>
                        <View className="bg-white/8 border border-white/10 rounded-2xl px-4 h-14 justify-center">
                            <TextInput
                                style={{ height: '100%', backgroundColor: 'transparent', color: '#fff', fontSize: 16 }}
                                placeholder="••••••••"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInUp.duration(600).delay(200)} className="w-full">
                    <Pressable
                        onPress={handleRegister}
                        disabled={!isValid || loading}
                        className={`w-full h-14 rounded-2xl items-center justify-center ${isValid && !loading ? 'bg-white active:opacity-80' : 'bg-white/20'}`}
                    >
                        <Text className={`text-lg font-bold ${isValid && !loading ? 'text-black' : 'text-white/40'}`}>
                            {loading ? 'Creating...' : 'Create Account'}
                        </Text>
                    </Pressable>
                    <View className="flex-row justify-center mt-6">
                        <Text className="text-white/30">Already have an account? </Text>
                        <Pressable onPress={() => Alert.alert('Navigate', 'Back to standard Login view')}>
                            <Text className="text-emerald-400 font-bold">Sign In</Text>
                        </Pressable>
                    </View>

                    {__DEV__ && (
                        <View className="mt-8 pt-6 border-t border-white/10">
                            <Pressable
                                onPress={handleDevSignIn}
                                className="w-full h-10 items-center justify-center active:opacity-80"
                            >
                                <Text className="text-white/40 text-sm font-semibold">Dev Sign In</Text>
                            </Pressable>
                            <Text className="text-xs text-white/20 text-center mt-1">
                                {DEV_EMAIL}
                            </Text>
                        </View>
                    )}
                </Animated.View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
