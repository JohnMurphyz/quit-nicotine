import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { ScreenTitle } from '@/src/components/ScreenTitle';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { supabase } from '@/src/lib/supabase';
import { useAuthStore } from '@/src/stores/authStore';
import type { AccountabilityPartner, Profile, StreakData } from '@/src/types';
import { Ionicons } from '@expo/vector-icons';
import { differenceInDays, differenceInMinutes } from 'date-fns';
import { BlurView } from 'expo-blur';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BenefitCard } from '@/src/components/BenefitCard';
import { JourneyBar } from '@/src/components/JourneyBar';
import { RecoveryRing } from '@/src/components/RecoveryRing';
import { getBenefitsForMotivations } from '@/src/constants/benefits';
import { getSymptomsForKeys } from '@/src/constants/symptoms';
import { useNavigation, useRoute } from '@react-navigation/native';

export function PartnerDashboardScreen() {
    const { user, profile, signOut } = useAuthStore();
    const colors = useThemeColors();
    const route = useRoute();
    const navigation = useNavigation();

    const isPreview = (route.name as string) === 'PartnerDashboardPreview';

    const [partnerProfile, setPartnerProfile] = useState<Profile | null>(null);
    const [permissions, setPermissions] = useState<AccountabilityPartner | null>(null);
    const [streakData, setStreakData] = useState<StreakData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'goals' | 'symptoms'>('goals');

    useEffect(() => {
        fetchPartnerData();
    }, []);

    const fetchPartnerData = async () => {
        if (isPreview) {
            if (!profile || !user?.id) {
                setLoading(false);
                return;
            }

            const params = route.params as any || {};

            // Mock permissions for preview, using passed route params if available
            setPartnerProfile(profile);
            setPermissions({
                id: 'preview',
                user_id: profile.id,
                partner_id: 'preview-partner',
                status: 'active',
                share_pledges: params.share_pledges ?? true,
                share_goals: params.share_goals ?? true,
                share_symptoms: params.share_symptoms ?? true,
                created_at: new Date().toISOString()
            });

            // Fetch Streak Data for primary user
            if (params.share_pledges ?? true) {
                const { data: sData, error: sError } = await supabase
                    .rpc('get_streak', { p_user_id: profile.id });

                if (!sError) setStreakData(sData);
            }
            setLoading(false);
            return;
        }

        if (!profile?.linked_to || !user?.id) {
            setLoading(false);
            return;
        }

        try {
            // 1. Fetch Partner's Profile
            const { data: pData, error: pError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', profile.linked_to)
                .single();

            if (pError) throw pError;
            setPartnerProfile(pData);

            // 2. Fetch Privacy Permissions
            const { data: permData, error: permError } = await supabase
                .from('accountability_partners')
                .select('*')
                .eq('user_id', profile.linked_to)
                .eq('partner_id', user.id)
                .single();

            if (permError) throw permError;
            setPermissions(permData);

            // 3. Fetch Streak Data if permitted
            if (permData.share_pledges) {
                const { data: sData, error: sError } = await supabase
                    .rpc('get_streak', { p_user_id: profile.linked_to });
                if (!sError) setStreakData(sData);
            }

        } catch (err) {
            console.error('Error loading partner dashboard:', err);
            Alert.alert('Error', 'Could not load your partner\'s data.');
        } finally {
            setLoading(false);
        }
    };

    const handleLeave = () => {
        Alert.alert(
            'Leave Partnership',
            'Are you sure you want to stop being an accountability partner? This will log you out.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Leave',
                    style: 'destructive',
                    onPress: async () => {
                        if (!isPreview && user?.id && profile?.linked_to) {
                            await supabase
                                .from('accountability_partners')
                                .delete()
                                .eq('partner_id', user.id)
                                .eq('user_id', profile.linked_to);
                        }
                        signOut();
                    }
                }
            ]
        );
    };

    const daysFree = useMemo(() => {
        if (!partnerProfile?.quit_date) return 0;
        return Math.max(0, differenceInDays(new Date(), new Date(partnerProfile.quit_date)));
    }, [partnerProfile?.quit_date]);

    const minutesSinceQuit = useMemo(() => {
        if (!partnerProfile?.quit_date) return 0;
        return Math.max(0, differenceInMinutes(new Date(), new Date(partnerProfile.quit_date)));
    }, [partnerProfile?.quit_date]);

    // Used for dynamic goal setting for the recovery ring
    const nextMilestoneDays = 90; // Defaulting to 90 days as standard goal for now if tracking is private
    const percentage = Math.min(100, (daysFree / nextMilestoneDays) * 100);

    const partnerBenefits = useMemo(() => {
        if (!partnerProfile?.motivations) return [];
        return getBenefitsForMotivations(partnerProfile.motivations);
    }, [partnerProfile?.motivations]);

    const partnerSymptoms = useMemo(() => {
        if (!partnerProfile?.tracked_symptoms) return [];
        return getSymptomsForKeys(partnerProfile.tracked_symptoms);
    }, [partnerProfile?.tracked_symptoms]);


    if (loading) {
        return (
            <AnimatedSkyBackground>
                <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Animated.View entering={FadeIn.duration(800)}>
                        <ActivityIndicator size="large" color={colors.textPrimary} />
                    </Animated.View>
                </SafeAreaView>
            </AnimatedSkyBackground>
        );
    }

    if (!partnerProfile || !permissions || permissions.status !== 'active') {
        return (
            <AnimatedSkyBackground>
                <SafeAreaView style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
                    <Animated.View entering={FadeInDown.duration(800)}>
                        <BlurView intensity={25} tint="light" style={{ borderRadius: 32, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' }}>
                            <View style={{ alignItems: 'center', padding: 40, backgroundColor: 'rgba(0,0,0,0.2)' }}>
                                <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(239, 68, 68, 0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                                    <Ionicons name="shield-half-outline" size={40} color="#ef4444" />
                                </View>
                                <Text style={{ fontSize: 28, fontWeight: '800', color: colors.textPrimary, marginBottom: 16, textAlign: 'center', letterSpacing: -0.5 }}>
                                    Access Revoked
                                </Text>
                                <Text style={{ fontSize: 16, color: colors.textSecondary, marginBottom: 40, textAlign: 'center', lineHeight: 24 }}>
                                    You no longer have access to this partner's dashboard. Their journey is now private.
                                </Text>
                                <Pressable onPress={signOut} style={({ pressed }) => ({
                                    paddingVertical: 18,
                                    paddingHorizontal: 32,
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: 20,
                                    width: '100%',
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.2)',
                                    opacity: pressed ? 0.7 : 1
                                })}>
                                    <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '700', letterSpacing: 0.5 }}>Disconnect & Sign Out</Text>
                                </Pressable>
                            </View>
                        </BlurView>
                    </Animated.View>
                </SafeAreaView>
            </AnimatedSkyBackground>
        );
    }

    const name = partnerProfile.display_name?.split(' ')[0] ?? 'Partner';

    return (
        <AnimatedSkyBackground>
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                {/* Immersive Header */}
                <Animated.View entering={FadeIn.duration(800)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}>
                    <View>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>
                            Dashboard
                        </Text>
                        <ScreenTitle style={{ fontSize: 32, letterSpacing: -1 }}>
                            {name}'s Journey
                        </ScreenTitle>
                    </View>
                    <Pressable onPress={handleLeave} style={({ pressed }) => ({
                        padding: 10,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 24,
                        opacity: pressed ? 0.7 : 1
                    })}>
                        <Ionicons name="exit-outline" size={24} color={colors.textPrimary} />
                    </Pressable>
                </Animated.View>

                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>

                    {/* Majestic Pledges Section with Side-by-Side Widgets */}
                    {permissions.share_pledges && (
                        <Animated.View entering={FadeInDown.delay(100).duration(1000)}>
                            {/* Top row with Days Free and Pledge status */}
                            <BlurView intensity={30} tint="light" style={{ borderRadius: 32, overflow: 'hidden', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
                                <View style={{ padding: 24, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                        <Ionicons name="leaf" size={16} color={colors.textSecondary} />
                                        <Text style={{ fontSize: 13, color: colors.textSecondary, textTransform: 'uppercase', fontWeight: '800', letterSpacing: 2 }}>
                                            Nicotine Free
                                        </Text>
                                    </View>

                                    {/* Gigantic elegant typography for Days Free */}
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 }}>
                                        <Text style={{ fontSize: 72, fontWeight: '300', color: colors.textPrimary, letterSpacing: -2, shadowColor: 'white', shadowOpacity: 0.1, shadowRadius: 10 }}>
                                            {daysFree}
                                        </Text>
                                        <Text style={{ fontSize: 20, fontWeight: '600', color: colors.textSecondary, letterSpacing: 0, marginLeft: 8 }}>
                                            days
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 20, backgroundColor: streakData?.confirmed_today ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.08)', borderRadius: 20, marginTop: 8, width: '100%', borderWidth: 1, borderColor: streakData?.confirmed_today ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.05)' }}>
                                        <Ionicons
                                            name={streakData?.confirmed_today ? "checkmark-circle" : "time"}
                                            size={20}
                                            color={streakData?.confirmed_today ? "#10b981" : colors.textMuted}
                                        />
                                        <Text style={{ fontSize: 15, fontWeight: '700', color: streakData?.confirmed_today ? '#10b981' : colors.textMuted, letterSpacing: 0.5 }}>
                                            {streakData?.confirmed_today ? "Pledged Today" : "Has not pledged yet"}
                                        </Text>
                                    </View>
                                </View>
                            </BlurView>

                            {/* Stacked Progress Widgets */}
                            <View style={{ gap: 12, marginBottom: 24 }}>
                                <BlurView intensity={25} tint="light" style={{ borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                    <View style={{ alignItems: 'center', paddingTop: 20 }}>
                                        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                                            Recovery Score
                                        </Text>
                                    </View>
                                    <View style={{ alignItems: 'center', transform: [{ scale: 0.8 }], marginTop: -20, marginBottom: -20 }}>
                                        <RecoveryRing percentage={percentage} daysFree={daysFree} nextMilestoneLabel="Next Goal" />
                                    </View>
                                </BlurView>

                                <BlurView intensity={25} tint="light" style={{ borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.02)', paddingBottom: 24 }}>
                                    <View style={{ alignItems: 'center', paddingTop: 20, paddingHorizontal: 20 }}>
                                        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                                            Timeline
                                        </Text>
                                    </View>
                                    <View style={{ alignItems: 'center', transform: [{ scale: 0.95 }], marginTop: -10 }}>
                                        <JourneyBar minutesSinceQuit={minutesSinceQuit} />
                                    </View>
                                </BlurView>
                            </View>
                        </Animated.View>
                    )}

                    {/* Tab Navigation for Goals and Symptoms */}
                    {(permissions.share_goals || permissions.share_symptoms) && (
                        <Animated.View entering={FadeInDown.delay(200).duration(800)}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    backgroundColor: colors.elevatedBg,
                                    borderRadius: 16,
                                    padding: 6,
                                    marginBottom: 24,
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.1)',
                                }}
                            >
                                {permissions.share_goals && (
                                    <Pressable
                                        onPress={() => setActiveTab('goals')}
                                        style={{
                                            flex: 1,
                                            paddingVertical: 12,
                                            borderRadius: 12,
                                            backgroundColor: activeTab === 'goals'
                                                ? 'rgba(255,255,255,0.12)'
                                                : 'transparent',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{ fontSize: 14, fontWeight: '700', color: activeTab === 'goals' ? colors.textPrimary : colors.textMuted }}>
                                            Goals
                                        </Text>
                                    </Pressable>
                                )}
                                {permissions.share_symptoms && (
                                    <Pressable
                                        onPress={() => setActiveTab('symptoms')}
                                        style={{
                                            flex: 1,
                                            paddingVertical: 12,
                                            borderRadius: 12,
                                            backgroundColor: activeTab === 'symptoms'
                                                ? 'rgba(255,255,255,0.12)'
                                                : 'transparent',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{ fontSize: 14, fontWeight: '700', color: activeTab === 'symptoms' ? colors.textPrimary : colors.textMuted }}>
                                            Symptoms
                                        </Text>
                                    </Pressable>
                                )}
                            </View>

                            {/* Tab Content Display */}
                            <Animated.View layout={LinearTransition.duration(600)} style={{ minHeight: 150 }}>
                                {activeTab === 'goals' && permissions.share_goals && (
                                    <Animated.View entering={FadeInDown.duration(600)}>
                                        {partnerBenefits.length > 0 ? (
                                            <View style={{
                                                borderWidth: 1,
                                                borderColor: 'rgba(255,255,255,0.15)',
                                                borderRadius: 16,
                                                backgroundColor: 'rgba(255,255,255,0.03)',
                                                overflow: 'hidden',
                                            }}>
                                                {partnerBenefits.map((benefit, i) => (
                                                    <BenefitCard
                                                        key={benefit.key}
                                                        title={benefit.title}
                                                        description={benefit.description}
                                                        icon={benefit.icon}
                                                        color={benefit.color}
                                                        progress={Math.min(daysFree / benefit.timelineDays, 1)}
                                                        isLast={i === partnerBenefits.length - 1}
                                                    />
                                                ))}
                                            </View>
                                        ) : (
                                            <View style={{ alignItems: 'center', padding: 30, opacity: 0.5 }}>
                                                <Ionicons name="star-outline" size={32} color={colors.textPrimary} style={{ marginBottom: 12 }} />
                                                <Text style={{ fontSize: 15, color: colors.textSecondary, textAlign: 'center' }}>{name} hasn't chosen any goals yet.</Text>
                                            </View>
                                        )}
                                    </Animated.View>
                                )}

                                {activeTab === 'symptoms' && permissions.share_symptoms && (
                                    <Animated.View entering={FadeInDown.duration(600)}>
                                        {partnerSymptoms.length > 0 ? (
                                            <View style={{
                                                borderWidth: 1,
                                                borderColor: 'rgba(255,255,255,0.15)',
                                                borderRadius: 16,
                                                backgroundColor: 'rgba(255,255,255,0.03)',
                                                overflow: 'hidden',
                                            }}>
                                                {partnerSymptoms.map((symptom, i) => {
                                                    const progress = Math.min(Math.max(daysFree / symptom.recoveryDays, 0), 1);
                                                    const description = progress >= 1 ? 'Recovered!' : symptom.recoveryLabel;
                                                    return (
                                                        <BenefitCard
                                                            key={symptom.key}
                                                            title={symptom.title}
                                                            description={description}
                                                            icon={symptom.icon}
                                                            color={symptom.color}
                                                            progress={progress}
                                                            isLast={i === partnerSymptoms.length - 1}
                                                        />
                                                    );
                                                })}
                                            </View>
                                        ) : (
                                            <View style={{ alignItems: 'center', padding: 30, opacity: 0.5 }}>
                                                <Ionicons name="pulse-outline" size={32} color={colors.textPrimary} style={{ marginBottom: 12 }} />
                                                <Text style={{ fontSize: 15, color: colors.textSecondary, textAlign: 'center' }}>{name} isn't tracking any symptoms yet.</Text>
                                            </View>
                                        )}
                                    </Animated.View>
                                )}
                            </Animated.View>
                        </Animated.View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </AnimatedSkyBackground>
    );
}
