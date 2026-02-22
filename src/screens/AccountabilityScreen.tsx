import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { ScreenTitle } from '@/src/components/ScreenTitle';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { supabase } from '@/src/lib/supabase';
import { useAuthStore } from '@/src/stores/authStore';
import type { AccountabilityPartner, Profile } from '@/src/types';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Share, Switch, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PartnerWithProfile extends AccountabilityPartner {
  partner_profile?: Pick<Profile, 'display_name' | 'email'>;
}

export default function AccountabilityScreen() {
  const { user, profile } = useAuthStore();
  const navigation = useNavigation();
  const colors = useThemeColors();
  const [partners, setPartners] = useState<PartnerWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('accountability_partners')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching partners:', error);
      setLoading(false);
      return;
    }

    let enriched = await Promise.all(
      (data ?? []).map(async (partner) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, email')
          .eq('id', partner.partner_id)
          .single();

        return { ...partner, partner_profile: profile ?? undefined };
      })
    );

    // DEMO OVERRIDE: If no partners are found, push a fake partner into the state so the user can preview the UI.
    if (enriched.length === 0) {
      enriched = [{
        id: 'fake-demo-partner-id',
        user_id: user.id || 'current-user',
        partner_id: 'fake-partner-uuid',
        created_at: new Date().toISOString(),
        status: 'active',
        share_pledges: true,
        share_goals: true,
        share_symptoms: true,
        partner_profile: {
          display_name: 'Sarah (Demo Partner)',
          email: 'sarah.demo@example.com'
        }
      }];
    }

    setPartners(enriched);
    setLoading(false);
  };

  const updatePartnerPermissions = async (
    partnerId: string,
    field: 'share_pledges' | 'share_goals' | 'share_symptoms',
    value: boolean
  ) => {
    setPartners(current =>
      current.map(p =>
        p.id === partnerId ? { ...p, [field]: value } : p
      )
    );

    if (partnerId === 'fake-demo-partner-id') return;

    const { error } = await supabase
      .from('accountability_partners')
      .update({ [field]: value })
      .eq('id', partnerId);

    if (error) {
      fetchPartners();
      Alert.alert('Error', 'Could not update permissions. Please try again.');
    }
  };

  const revokePartner = async (partnerId: string) => {
    if (partnerId === 'fake-demo-partner-id') {
      setPartners(current => current.map(p => p.id === partnerId ? { ...p, status: 'revoked' } : p));
      return;
    }

    Alert.alert(
      'Revoke Access',
      'This partner will no longer be able to see your progress.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: async () => {
            setPartners(current => current.map(p => p.id === partnerId ? { ...p, status: 'revoked' } : p));
            await supabase
              .from('accountability_partners')
              .update({ status: 'revoked' })
              .eq('id', partnerId);
            fetchPartners();
          },
        },
      ]
    );
  };

  const activePartners = partners.filter((p) => p.status === 'active');
  const revokedPartners = partners.filter((p) => p.status === 'revoked');

  const PermissionToggle = ({
    label,
    icon,
    value,
    onValueChange
  }: {
    label: string,
    icon: keyof typeof Ionicons.glyphMap,
    value: boolean,
    onValueChange: (v: boolean) => void
  }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: value ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icon} size={16} color={value ? '#10b981' : colors.textMuted} />
        </View>
        <Text style={{ fontSize: 16, fontWeight: '500', color: value ? colors.textPrimary : colors.textSecondary }}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(16, 185, 129, 0.5)' }}
        thumbColor={value ? '#10b981' : '#a1a1aa'}
        ios_backgroundColor="rgba(255,255,255,0.1)"
      />
    </View>
  );

  const handleInvite = async () => {
    if (!profile?.invite_code) {
      Alert.alert('Error', 'Invite code not found. Please try logging out and back in.');
      return;
    }

    try {
      await Share.share({
        message: `I'm quitting nicotine on FREED! Join me as my accountability partner and help me stay on track: freed://invite/${profile.invite_code}`,
      });
    } catch (error) {
      console.error('Error sharing invite:', error);
    }
  };

  return (
    <AnimatedSkyBackground>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Sleek Header */}
        <Animated.View entering={FadeIn.duration(600)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable onPress={() => navigation.goBack()} style={{ padding: 8, marginLeft: -8, marginRight: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20 }}>
              <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
            </Pressable>
            <ScreenTitle>Partners</ScreenTitle>
          </View>

          {/* Subtle Dev Preview Triggers */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable onPress={() => (navigation as any).navigate('InvitePreview', { code: profile?.invite_code || 'preview' })} style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20 }}>
              <Ionicons name="mail-unread-outline" size={20} color={colors.textSecondary} />
            </Pressable>
            <Pressable onPress={() => (navigation as any).navigate('PartnerDashboardPreview')} style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20 }}>
              <Ionicons name="eye-outline" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>
        </Animated.View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

          {/* Majestic Invite Card */}
          <Animated.View entering={FadeInDown.delay(100).duration(800)}>
            <Pressable onPress={handleInvite} style={{ marginBottom: 32 }}>
              <BlurView intensity={30} tint="light" style={{ borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
                <View style={{ padding: 28, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Ionicons name="person-add" size={28} color={colors.textPrimary} style={{ marginLeft: 4 }} />
                  </View>
                  <Text style={{ fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: 8, letterSpacing: -0.5 }}>
                    Invite a Partner
                  </Text>
                  <Text style={{ fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, paddingHorizontal: 12 }}>
                    Share your journey with someone you trust. They'll get a private dashboard to cheer you on.
                  </Text>
                </View>
              </BlurView>
            </Pressable>
          </Animated.View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.textSecondary} style={{ marginTop: 40 }} />
          ) : (
            <Animated.View layout={LinearTransition.duration(600)}>
              {activePartners.length > 0 && (
                <View style={{ marginBottom: 24 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 16, paddingLeft: 8 }}>
                    Your Partners
                  </Text>

                  {activePartners.map((partner, index) => (
                    <Animated.View key={partner.id} entering={FadeInDown.delay(200 + (index * 100)).duration(800)} style={{ marginBottom: 16 }}>
                      <BlurView intensity={20} tint="light" style={{ borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>

                        {/* Partner Header - Clickable for Preview */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', paddingRight: 16 }}>
                          <Pressable
                            style={({ pressed }) => ({
                              flex: 1,
                              flexDirection: 'row',
                              alignItems: 'center',
                              padding: 20,
                              opacity: pressed ? 0.8 : 1
                            })}
                            onPress={() => (navigation as any).navigate('PartnerDashboardPreview', {
                              share_pledges: partner.share_pledges ?? true,
                              share_goals: partner.share_goals ?? true,
                              share_symptoms: partner.share_symptoms ?? true,
                            })}
                          >
                            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                              <Text style={{ fontSize: 20, fontWeight: '800', color: colors.textPrimary }}>
                                {(partner.partner_profile?.display_name || 'P')[0].toUpperCase()}
                              </Text>
                            </View>
                            <View style={{ flex: 1, paddingRight: 8 }}>
                              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 }} numberOfLines={1}>
                                {partner.partner_profile?.display_name ?? 'Guest Partner'}
                              </Text>
                              {partner.partner_profile?.email && (
                                <Text style={{ fontSize: 13, color: colors.textMuted }} numberOfLines={1}>
                                  {partner.partner_profile?.email}
                                </Text>
                              )}
                            </View>
                          </Pressable>
                          <Pressable onPress={() => revokePartner(partner.id)} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(239, 68, 68, 0.15)', borderRadius: 18 }}>
                            <Ionicons name="close" size={18} color="#ef4444" />
                          </Pressable>
                        </View>

                        {/* Permissions Toggles */}
                        <View style={{ padding: 20, paddingTop: 8 }}>
                          <PermissionToggle
                            label="Daily Pledges & Streak"
                            icon="leaf"
                            value={partner.share_pledges ?? true}
                            onValueChange={(val) => updatePartnerPermissions(partner.id, 'share_pledges', val)}
                          />
                          <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.05)' }} />
                          <PermissionToggle
                            label="Quit Goals & Motivations"
                            icon="star"
                            value={partner.share_goals ?? true}
                            onValueChange={(val) => updatePartnerPermissions(partner.id, 'share_goals', val)}
                          />
                          <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.05)' }} />
                          <PermissionToggle
                            label="Tracked Symptoms"
                            icon="pulse"
                            value={partner.share_symptoms ?? true}
                            onValueChange={(val) => updatePartnerPermissions(partner.id, 'share_symptoms', val)}
                          />
                        </View>

                      </BlurView>
                    </Animated.View>
                  ))}
                </View>
              )}

              {revokedPartners.length > 0 && (
                <View style={{ marginTop: 16 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 16, paddingLeft: 8 }}>
                    Revoked Access
                  </Text>
                  {revokedPartners.map((partner, index) => (
                    <Animated.View key={partner.id} entering={FadeInDown.delay(300 + (index * 50)).duration(800)} style={{ marginBottom: 12 }}>
                      <BlurView intensity={10} tint="light" style={{ borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, opacity: 0.6 }}>
                          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                            <Ionicons name="person-outline" size={16} color={colors.textMuted} />
                          </View>
                          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textSecondary }}>
                            {partner.partner_profile?.display_name ?? 'Guest Partner'}
                          </Text>
                        </View>
                      </BlurView>
                    </Animated.View>
                  ))}
                </View>
              )}
            </Animated.View>
          )}

        </ScrollView>
      </SafeAreaView>
    </AnimatedSkyBackground>
  );
}
