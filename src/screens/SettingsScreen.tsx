import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@/src/stores/authStore';
import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { useSkyThemeStore } from '@/src/stores/skyThemeStore';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useCheckInInterval } from '@/src/hooks/useCheckInInterval';
import type { NicotineType } from '@/src/types/database';

const NICOTINE_OPTIONS: { label: string; value: NicotineType }[] = [
  { label: 'Cigarettes', value: 'cigarettes' },
  { label: 'Vapes', value: 'vapes' },
  { label: 'Pouches', value: 'pouches' },
  { label: 'Chewing', value: 'chewing' },
  { label: 'Multiple', value: 'multiple' },
];

export default function SettingsScreen() {
  const { profile, signOut, updateProfile } = useAuthStore();
  const { theme: skyTheme, setTheme: setSkyTheme } = useSkyThemeStore();
  const { resetCheckIn } = useCheckInInterval();
  const colors = useThemeColors();
  const navigation = useNavigation();

  const handleEditName = () => {
    Alert.prompt(
      'Edit Name',
      'Enter your display name',
      async (text) => {
        if (text !== undefined) {
          try {
            await updateProfile({ display_name: text.trim() || null });
          } catch (e: any) {
            Alert.alert('Error', e.message);
          }
        }
      },
      'plain-text',
      profile?.display_name ?? '',
    );
  };

  const handleEditQuitDate = () => {
    Alert.prompt(
      'Edit Quit Date',
      'Enter your quit date (YYYY-MM-DD)',
      async (text) => {
        if (text !== undefined && text.trim()) {
          try {
            await updateProfile({ quit_date: text.trim() });
          } catch (e: any) {
            Alert.alert('Error', e.message);
          }
        }
      },
      'plain-text',
      profile?.quit_date ?? '',
    );
  };

  const handleEditDailyCost = () => {
    Alert.prompt(
      'Edit Daily Cost',
      'Enter your daily nicotine cost ($)',
      async (text) => {
        if (text !== undefined && text.trim()) {
          const cost = parseFloat(text.trim());
          if (isNaN(cost)) {
            Alert.alert('Invalid', 'Please enter a valid number.');
            return;
          }
          try {
            await updateProfile({ daily_cost: cost });
          } catch (e: any) {
            Alert.alert('Error', e.message);
          }
        }
      },
      'plain-text',
      profile?.daily_cost?.toString() ?? '',
    );
  };

  const handleEditNicotineType = () => {
    Alert.alert(
      'Nicotine Type',
      'Select your primary nicotine product',
      NICOTINE_OPTIONS.map((opt) => ({
        text: opt.label,
        onPress: async () => {
          try {
            await updateProfile({ nicotine_type: opt.value });
          } catch (e: any) {
            Alert.alert('Error', e.message);
          }
        },
      })).concat([{ text: 'Cancel', onPress: async () => {} }]),
    );
  };

  const handleSignOut = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete profile & data',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Coming Soon', 'Account deletion will be available in a future update. Contact support for immediate assistance.');
          },
        },
      ],
    );
  };

  const profileFields: { label: string; value: string | null | undefined; onPress?: () => void }[] = [
    { label: 'Email', value: profile?.email },
    { label: 'Name', value: profile?.display_name, onPress: handleEditName },
    { label: 'Quit Date', value: profile?.quit_date, onPress: handleEditQuitDate },
    {
      label: 'Nicotine Type',
      value: profile?.nicotine_type
        ? profile.nicotine_type.charAt(0).toUpperCase() + profile.nicotine_type.slice(1)
        : null,
      onPress: handleEditNicotineType,
    },
    {
      label: 'Daily Cost',
      value: profile?.daily_cost ? `$${profile.daily_cost}/day` : null,
      onPress: handleEditDailyCost,
    },
    { label: 'Timezone', value: profile?.timezone },
  ];

  return (
    <AnimatedSkyBackground>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-5 pt-4 pb-2">
          <Pressable onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary }}>Settings</Text>
        </View>

        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          {/* Profile Fields */}
          {profileFields.map((field) => {
            const Container = field.onPress ? Pressable : View;
            return (
              <Container
                key={field.label}
                {...(field.onPress ? { onPress: field.onPress } : {})}
              >
                <View
                  className="py-4"
                  style={{ borderBottomWidth: 1, borderBottomColor: colors.borderColor }}
                >
                  <Text className="text-xs font-medium mb-1" style={{ color: colors.textAccent }}>
                    {field.label}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <Text style={{ fontSize: 18, fontWeight: '500', color: colors.textPrimary }}>
                      {field.value ?? '-'}
                    </Text>
                    {field.onPress && (
                      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                    )}
                  </View>
                </View>
              </Container>
            );
          })}

          {/* Sky Theme */}
          <View className="mt-6 mb-2">
            <Text className="text-xs font-medium mb-3" style={{ color: '#7c3aed' }}>
              Background Theme
            </Text>
            <View className="flex-row gap-3">
              {([
                { key: 'static' as const, label: 'Night Sky', icon: 'moon' as const },
                { key: 'light' as const, label: 'Light', icon: 'contrast' as const },
              ]).map((opt) => (
                <Pressable
                  key={opt.key}
                  onPress={() => setSkyTheme(opt.key)}
                  className="flex-1 rounded-xl py-3 items-center"
                  style={{
                    backgroundColor: skyTheme === opt.key ? (colors.isDark ? 'rgba(124,58,237,0.25)' : '#ebe1d4') : colors.cardBg,
                    borderWidth: 1,
                    borderColor: skyTheme === opt.key ? colors.textAccent : colors.borderColor,
                  }}
                >
                  <Ionicons
                    name={opt.icon}
                    size={22}
                    color={skyTheme === opt.key ? colors.textSecondary : colors.textMuted}
                  />
                  <Text
                    className="text-xs mt-1 font-medium"
                    style={{ color: skyTheme === opt.key ? colors.textSecondary : colors.textMuted }}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text className="text-xs mt-2" style={{ color: colors.textMuted }}>
              {skyTheme === 'light'
                ? 'Classic warm cream theme'
                : 'Always-dark sky with twinkling stars'}
            </Text>
          </View>

          {/* Reset Daily Pledge */}
          <View className="mt-6">
            <Pressable
              onPress={() => {
                Alert.alert(
                  'Reset Daily Pledge',
                  'This will reset your daily pledge so you can pledge again. Continue?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Reset',
                      onPress: () => resetCheckIn(),
                    },
                  ],
                );
              }}
              style={{
                borderWidth: 1,
                borderColor: colors.borderColor,
                borderRadius: 12,
                padding: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textSecondary }}>
                Reset Daily Pledge
              </Text>
            </Pressable>
          </View>

          {/* Restart Onboarding */}
          <View className="mt-6">
            <Pressable
              onPress={() => {
                Alert.alert(
                  'Restart Onboarding',
                  'This will take you back through the setup process. Your data will be preserved.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Restart',
                      onPress: async () => {
                        try {
                          await updateProfile({ onboarding_completed: false });
                        } catch (e: any) {
                          Alert.alert('Error', e.message);
                        }
                      },
                    },
                  ],
                );
              }}
              style={{
                borderWidth: 1,
                borderColor: colors.borderColor,
                borderRadius: 12,
                padding: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textSecondary }}>
                Restart Onboarding
              </Text>
            </Pressable>
          </View>

          {/* Danger Zone */}
          <View className="mt-8">
            <Pressable onPress={handleDeleteAccount} className="py-3">
              <Text className="text-base font-semibold" style={{ color: '#ef4444' }}>
                Delete profile & data
              </Text>
            </Pressable>

            <Pressable onPress={handleSignOut} className="py-3">
              <Text className="text-base font-semibold" style={{ color: '#ef4444' }}>
                Log out
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AnimatedSkyBackground>
  );
}
