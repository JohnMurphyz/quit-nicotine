import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { ScreenTitle } from '@/src/components/ScreenTitle';
import { useStreak } from '@/src/hooks/useStreak';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useAuthStore } from '@/src/stores/authStore';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { decode } from 'base64-arraybuffer';
import { differenceInCalendarDays } from 'date-fns';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, Platform, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const colors = useThemeColors();
  const navigation = useNavigation<Nav>();
  const [uploading, setUploading] = useState(false);

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

  const moneySaved = (profile?.daily_cost && daysFree > 0)
    ? profile.daily_cost * daysFree
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
          <ScreenTitle>Profile</ScreenTitle>
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                }}
              >
                <Ionicons name="wallet" size={24} color="#10b981" style={{ width: 32 }} />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={{ fontSize: 17, fontWeight: '600', color: colors.textPrimary }}>
                    Money Saved
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
                    {profile?.daily_cost ? `$${profile.daily_cost.toFixed(0)}/day saved since quitting` : 'Set your daily cost in settings'}
                  </Text>
                </View>
                <Text style={{ fontSize: 22, fontWeight: '800', color: '#10b981' }}>
                  ${moneySaved.toFixed(0)}
                </Text>
              </View>
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
                onPress={() => navigation.navigate('Feedback')}
              />
              <View style={{ height: 1, backgroundColor: colors.borderColor, marginHorizontal: 16 }} />
              <MenuRow
                icon="help-circle"
                iconColor="#ef4444"
                title="Contact Us"
                subtitle="Get in touch with the FREED team"
                colors={colors}
                onPress={() => navigation.navigate('ContactUs')}
                isLast
              />
            </View>
          </View>
        </ScrollView>

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
