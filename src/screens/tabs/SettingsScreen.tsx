import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Share, Platform, Alert, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { differenceInCalendarDays } from 'date-fns';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { useAuthStore } from '@/src/stores/authStore';
import { useStreak } from '@/src/hooks/useStreak';
import { useAchievements } from '@/src/hooks/useAchievements';
import { useTimeline } from '@/src/hooks/useTimeline';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { MeditateModal } from '@/src/components/MeditateModal';
import { ACHIEVEMENTS } from '@/src/constants/achievements';
import { INVITE_WEB_DOMAIN } from '@/src/constants/config';
import { supabase } from '@/src/lib/supabase';
import type { AppStackParamList, TabParamList } from '@/src/navigation/types';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Profile'>,
  NativeStackNavigationProp<AppStackParamList>
>;

export default function ProfileScreen() {
  const { profile, user, updateProfile } = useAuthStore();
  const { streak } = useStreak();
  const { achievements } = useAchievements();
  const { nextMilestone } = useTimeline();
  const colors = useThemeColors();
  const navigation = useNavigation<Nav>();
  const [showMeditate, setShowMeditate] = useState(false);
  const [uploading, setUploading] = useState(false);

  const unlockedKeys = new Set(achievements.map((a) => a.achievement_key));
  const displayName = profile?.display_name || 'You';

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo library access to upload a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (result.canceled || !result.assets?.length) return;
    const asset = result.assets[0];
    const base64Data = asset.base64;
    if (!base64Data || !user?.id) return;

    setUploading(true);
    try {
      const ext = asset.uri.split('.').pop()?.toLowerCase() ?? 'jpg';
      const filePath = `${user.id}/avatar.${ext}`;
      const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, decode(base64Data), {
          contentType,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      await updateProfile({ avatar_url: avatarUrl });
    } catch (e: any) {
      Alert.alert('Upload failed', e.message ?? 'Something went wrong.');
    } finally {
      setUploading(false);
    }
  };

  const daysFree = profile?.quit_date
    ? Math.max(0, differenceInCalendarDays(new Date(), new Date(profile.quit_date)))
    : 0;

  const longestStreak = streak?.longest_streak ?? 0;

  // Days until next health milestone
  const daysToNext = nextMilestone
    ? Math.ceil(nextMilestone.minutesRemaining / (60 * 24))
    : 0;

  const handleShare = async () => {
    if (!profile?.invite_code) return;
    const webLink = `https://${INVITE_WEB_DOMAIN}/invite/${profile.invite_code}`;
    const message = `Track my nicotine-free journey! Join as my accountability partner: ${webLink}`;

    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(webLink);
      }
      alert('Link copied!');
      return;
    }

    try {
      await Share.share({ message });
    } catch {
      await Clipboard.setStringAsync(webLink);
      Alert.alert('Copied!', 'Invite link copied to clipboard.');
    }
  };

  return (
    <AnimatedSkyBackground>
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.textPrimary }}>
            Profile
          </Text>
          <Pressable onPress={() => navigation.navigate('Settings')}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textSecondary }}>
              Settings
            </Text>
          </Pressable>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          {/* Avatar */}
          <View className="items-center mt-4">
            <Pressable onPress={handlePickAvatar} disabled={uploading}>
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: colors.elevatedBg,
                  borderWidth: 3,
                  borderColor: colors.borderColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  opacity: uploading ? 0.5 : 1,
                }}
              >
                {profile?.avatar_url ? (
                  <Image
                    source={{ uri: profile.avatar_url }}
                    style={{ width: 100, height: 100 }}
                  />
                ) : (
                  <Ionicons name="person" size={44} color={colors.textMuted} />
                )}
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: colors.isDark ? '#6d28d9' : '#7c3aed',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: colors.isDark ? '#0a0a23' : '#faf7f4',
                }}
              >
                <Ionicons name="camera" size={14} color="#ffffff" />
              </View>
            </Pressable>
          </View>

          {/* Name */}
          <Text
            style={{
              fontSize: 26,
              fontWeight: '700',
              color: colors.textPrimary,
              textAlign: 'center',
              marginTop: 12,
            }}
          >
            {displayName}
          </Text>

          {/* Stats row */}
          <View className="flex-row items-center justify-center mt-3" style={{ gap: 20 }}>
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <Ionicons name="flame" size={18} color="#f97316" />
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#f97316', letterSpacing: 1 }}>
                {streak?.current_streak ?? 0} DAY STREAK
              </Text>
            </View>
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <Ionicons name="leaf" size={18} color="#22c55e" />
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#22c55e', letterSpacing: 1 }}>
                {daysFree} DAYS FREE
              </Text>
            </View>
          </View>

          {/* Achievement badges row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-6"
            contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
          >
            {ACHIEVEMENTS.slice(0, 10).map((ach) => {
              const unlocked = unlockedKeys.has(ach.key);
              return (
                <View
                  key={ach.key}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: unlocked
                      ? (colors.isDark ? 'rgba(251,191,36,0.15)' : '#fef3c7')
                      : colors.elevatedBg,
                    borderWidth: 2,
                    borderColor: unlocked
                      ? (colors.isDark ? 'rgba(251,191,36,0.4)' : '#fbbf24')
                      : colors.borderColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons
                    name={ach.icon as any}
                    size={24}
                    color={unlocked ? '#fbbf24' : colors.textMuted}
                  />
                </View>
              );
            })}
          </ScrollView>

          {/* View Progress Card button */}
          <View className="px-5 mt-6">
            <Pressable
              onPress={() => navigation.navigate('Tabs', { screen: 'Timeline' })}
              style={{
                borderRadius: 30,
                paddingVertical: 14,
                alignItems: 'center',
                backgroundColor: colors.isDark ? '#6d28d9' : '#7c3aed',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#ffffff' }}>
                View Progress Card
              </Text>
            </Pressable>
          </View>

          {/* Stats cards */}
          <View className="px-5 mt-6">
            <View
              style={{
                flexDirection: 'row',
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.borderColor,
                backgroundColor: colors.cardBg,
                overflow: 'hidden',
              }}
            >
              {/* Best Record */}
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 24,
                  borderRightWidth: 1,
                  borderRightColor: colors.borderColor,
                }}
              >
                <Ionicons name="trophy" size={32} color="#fbbf24" />
                <Text
                  style={{
                    fontSize: 40,
                    fontWeight: '800',
                    color: '#fbbf24',
                    marginTop: 4,
                  }}
                >
                  {longestStreak}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: colors.textMuted,
                    letterSpacing: 2,
                  }}
                >
                  BEST RECORD
                </Text>
              </View>

              {/* Days to next milestone */}
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 24,
                }}
              >
                <Ionicons name="flag" size={32} color="#22c55e" />
                <Text
                  style={{
                    fontSize: 40,
                    fontWeight: '800',
                    color: '#22c55e',
                    marginTop: 4,
                  }}
                >
                  {daysToNext}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: colors.textMuted,
                    letterSpacing: 2,
                  }}
                >
                  TIL MILESTONE
                </Text>
              </View>
            </View>
          </View>

          {/* Invite Friends card */}
          {profile?.invite_code && (
            <View className="px-5 mt-6">
              <View
                style={{
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: colors.borderColor,
                  backgroundColor: colors.cardBg,
                  padding: 20,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textMuted }}>
                  Invite Your Friends
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: colors.textPrimary,
                    marginTop: 4,
                    marginBottom: 16,
                  }}
                >
                  Quit together, stay strong
                </Text>
                <Pressable
                  onPress={handleShare}
                  style={{
                    backgroundColor: colors.isDark ? '#ffffff' : '#362d23',
                    borderRadius: 30,
                    paddingVertical: 12,
                    paddingHorizontal: 48,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: colors.isDark ? '#0f0d2e' : '#ffffff',
                    }}
                  >
                    Share
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Craving Control section */}
          <View className="px-5 mt-6">
            <View
              style={{
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.borderColor,
                backgroundColor: colors.cardBg,
              }}
            >
              <MenuRow
                icon="hand-left"
                iconColor="#f97316"
                title="Craving Control"
                subtitle="Focus on breath-work when tempted to relapse"
                colors={colors}
                onPress={() => navigation.navigate('CravingSOS')}
              />
              <View style={{ height: 1, backgroundColor: colors.borderColor, marginHorizontal: 16 }} />
              <MenuRow
                icon="fitness"
                iconColor="#a855f7"
                title="Detox"
                subtitle="Reset your mind after a relapse"
                colors={colors}
                onPress={() => setShowMeditate(true)}
                isLast
              />
            </View>
          </View>

          {/* Personal section */}
          <View className="px-5 mt-6">
            <Text style={{ fontSize: 14, fontWeight: '800', color: colors.textPrimary, letterSpacing: 1, marginBottom: 12 }}>
              Personal
            </Text>
            <View
              style={{
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.borderColor,
                backgroundColor: colors.cardBg,
              }}
            >
              <MenuRow
                icon="heart"
                iconColor="#22c55e"
                title="Reasons for Changing"
                subtitle="Remind yourself why you are quitting"
                colors={colors}
                onPress={() => navigation.navigate('Reasons')}
              />
              <View style={{ height: 1, backgroundColor: colors.borderColor, marginHorizontal: 16 }} />
              <MenuRow
                icon="journal"
                iconColor="#f59e0b"
                title="Recovery Journal"
                subtitle="Private notes to help you stay on track"
                colors={colors}
                onPress={() => navigation.navigate('JournalList')}
                isLast
              />
            </View>
          </View>

          {/* App section */}
          <View className="px-5 mt-6 mb-4">
            <Text style={{ fontSize: 14, fontWeight: '800', color: colors.textPrimary, letterSpacing: 1, marginBottom: 12 }}>
              FREED
            </Text>
            <View
              style={{
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.borderColor,
                backgroundColor: colors.cardBg,
              }}
            >
              <MenuRow
                icon="chatbubbles"
                iconColor="#3b82f6"
                title="Give Feedback"
                subtitle="Help us make FREED better"
                colors={colors}
                onPress={() => Linking.openURL('mailto:feedback@freed.app?subject=FREED%20Feedback')}
              />
              <View style={{ height: 1, backgroundColor: colors.borderColor, marginHorizontal: 16 }} />
              <MenuRow
                icon="help-circle"
                iconColor="#ef4444"
                title="Contact Us"
                subtitle="Get in touch with the FREED team"
                colors={colors}
                onPress={() => Linking.openURL('mailto:support@freed.app')}
                isLast
              />
            </View>
          </View>
        </ScrollView>

        <MeditateModal visible={showMeditate} onClose={() => setShowMeditate(false)} />
      </SafeAreaView>
    </AnimatedSkyBackground>
  );
}

function MenuRow({
  icon,
  iconColor,
  title,
  subtitle,
  colors,
  onPress,
  isLast,
}: {
  icon: string;
  iconColor: string;
  title: string;
  subtitle: string;
  colors: ReturnType<typeof useThemeColors>;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
      }}
    >
      <Ionicons name={icon as any} size={24} color={iconColor} style={{ width: 32 }} />
      <View style={{ flex: 1, marginLeft: 8 }}>
        <Text style={{ fontSize: 17, fontWeight: '600', color: colors.textPrimary }}>
          {title}
        </Text>
        <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
          {subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </Pressable>
  );
}
