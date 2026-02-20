import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { supabase } from '@/src/lib/supabase';
import { useAuthStore } from '@/src/stores/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<any, 'Invite'>;

export default function InviteScreen({ route }: Props) {
    const { code } = route.params as { code?: string };
    const navigation = useNavigation();
    const colors = useThemeColors();
    const [inviterName, setInviterName] = useState<string | null>(null);
    const [inviterId, setInviterId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const glowOpacity = useSharedValue(0.3);
    const glowScale = useSharedValue(1);

    useEffect(() => {
        glowOpacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 2000 }),
                withTiming(0.3, { duration: 2000 })
            ),
            -1,
            true
        );
        glowScale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 2000 }),
                withTiming(1, { duration: 2000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedGlow = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
        transform: [{ scale: glowScale.value }]
    }));

    useEffect(() => {
        if (code) {
            resolveInvite(code);
        } else {
            setLoading(false);
            Alert.alert('Invalid Link', 'No invite code was found in the link.');
        }
    }, [code]);

    const resolveInvite = async (inviteCode: string) => {
        const { data: profileData, error } = await supabase
            .from('profiles')
            .select('id, display_name')
            .eq('invite_code', inviteCode)
            .single();

        if (error || !profileData) {
            console.log('Error resolving invite:', error);
            Alert.alert('Invalid Link', 'This invite link is invalid or has expired.');
        } else {
            setInviterName(profileData.display_name ?? 'A friend');
            setInviterId(profileData.id);
        }
        setLoading(false);
    };

    const isPreview = (route.name as string) === 'InvitePreview';
    const [joining, setJoining] = useState(false);

    const handleJoin = async () => {
        if (isPreview) {
            Alert.alert(
                "Preview Mode",
                "This is what your partner will see. They'll join seamlessly without a password.",
                [{ text: "Awesome", onPress: () => navigation.goBack() }]
            );
            return;
        }

        if (!inviterId) return;
        setJoining(true);

        try {
            const { data: authData, error: authError } = await supabase.auth.signInAnonymously();

            if (authError || !authData.user) {
                throw authError || new Error('Failed to create guest account');
            }

            const newUserId = authData.user.id;
            await new Promise(resolve => setTimeout(resolve, 500));

            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    role: 'guest',
                    linked_to: inviterId,
                    onboarding_completed: true,
                    display_name: 'Guest Partner',
                })
                .eq('id', newUserId);

            if (profileError) throw profileError;

            const { error: partnerError } = await supabase
                .from('accountability_partners')
                .insert({
                    user_id: inviterId,
                    partner_id: newUserId,
                    status: 'active',
                });

            if (partnerError) throw partnerError;

            const authStore = useAuthStore.getState();
            await authStore.initialize();

        } catch (error: any) {
            console.error('Error joining as partner:', error);
            Alert.alert('Join Failed', error.message || 'Could not join as a partner. Please try again.');
        } finally {
            setJoining(false);
        }
    };

    return (
        <AnimatedSkyBackground>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
                <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
                    {loading ? (
                        <Animated.View entering={FadeIn.duration(800)} style={{ alignItems: 'center' }}>
                            <ActivityIndicator size="large" color={colors.textPrimary} />
                        </Animated.View>
                    ) : inviterId ? (
                        <View style={{ alignItems: 'center' }}>
                            {/* Glowing Avatar Setup */}
                            <Animated.View entering={FadeInDown.delay(100).duration(1000)}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
                                    <Animated.View style={[{ position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.1)', filter: 'blur(10px)' }, animatedGlow]} />
                                    <BlurView intensity={25} tint="light" style={{ width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
                                        <Text style={{ fontSize: 44, fontWeight: '800', color: colors.textPrimary, shadowColor: 'white', shadowOpacity: 0.2, shadowRadius: 10 }}>
                                            {inviterName?.charAt(0).toUpperCase()}
                                        </Text>
                                    </BlurView>
                                </View>
                            </Animated.View>

                            {/* Text Typography */}
                            <Animated.View entering={FadeInDown.delay(200).duration(800)}>
                                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textMuted, textAlign: 'center', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
                                    Private Invitation
                                </Text>
                            </Animated.View>

                            <Animated.View entering={FadeInDown.delay(300).duration(800)}>
                                <Text style={{ fontSize: 40, fontWeight: '800', color: colors.textPrimary, textAlign: 'center', marginBottom: 24, letterSpacing: -1, lineHeight: 46 }}>
                                    Join {inviterName?.split(' ')[0]}'s{'\n'}Journey
                                </Text>
                            </Animated.View>

                            <Animated.View entering={FadeInDown.delay(400).duration(800)}>
                                <Text style={{ fontSize: 18, color: colors.textSecondary, textAlign: 'center', marginBottom: 60, lineHeight: 28, paddingHorizontal: 20 }}>
                                    They are quitting nicotine and chose <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>you</Text> as their accountability partner.
                                </Text>
                            </Animated.View>

                            {/* Sophisticated Custom Buttons */}
                            <Animated.View entering={FadeInDown.delay(500).duration(800)} style={{ width: '100%', gap: 16 }}>
                                <Pressable
                                    onPress={handleJoin}
                                    disabled={joining}
                                >
                                    {({ pressed }) => (
                                        <View style={{ opacity: pressed || joining ? 0.7 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }}>
                                            <BlurView intensity={40} tint="light" style={{ borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}>
                                                <View style={{ paddingVertical: 18, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                                    {joining ? (
                                                        <ActivityIndicator size="small" color={colors.textPrimary} />
                                                    ) : (
                                                        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary, letterSpacing: 0.5 }}>
                                                            Accept & Join
                                                        </Text>
                                                    )}
                                                </View>
                                            </BlurView>
                                        </View>
                                    )}
                                </Pressable>

                                <Pressable
                                    onPress={() => (navigation as any).navigate('Welcome')}
                                    disabled={joining}
                                >
                                    {({ pressed }) => (
                                        <View style={{ opacity: pressed || joining ? 0.5 : 1, paddingVertical: 16, alignItems: 'center' }}>
                                            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textMuted }}>
                                                Decline Invitation
                                            </Text>
                                        </View>
                                    )}
                                </Pressable>
                            </Animated.View>
                        </View>
                    ) : (
                        <View style={{ alignItems: 'center' }}>
                            <Animated.View entering={FadeInDown.duration(800)} style={{ alignItems: 'center' }}>
                                <BlurView intensity={20} tint="light" style={{ width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                                    <Ionicons name="alert-circle-outline" size={36} color={colors.textPrimary} />
                                </BlurView>
                                <Text style={{ fontSize: 24, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 }}>
                                    Invite Expired
                                </Text>
                                <Pressable onPress={() => (navigation as any).navigate('Welcome')} style={{ paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary }}>Go Home</Text>
                                </Pressable>
                            </Animated.View>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </AnimatedSkyBackground>
    );
}
