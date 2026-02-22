import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { ScreenTitle } from '@/src/components/ScreenTitle';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Linking, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CONTACT_LINKS = [
  {
    icon: 'mail' as const,
    iconColor: '#3b82f6',
    title: 'Email',
    subtitle: 'support@freed.app',
    url: 'mailto:support@freed.app',
  },
  {
    icon: 'logo-instagram' as const,
    iconColor: '#e1306c',
    title: 'Instagram',
    subtitle: '@freed',
    url: 'https://instagram.com/freed',
  },
  {
    icon: 'logo-twitter' as const,
    iconColor: '#000000',
    title: 'Twitter / X',
    subtitle: '@freed',
    url: 'https://x.com/freed',
  },
  {
    icon: 'logo-tiktok' as const,
    iconColor: '#000000',
    title: 'TikTok',
    subtitle: '@freed',
    url: 'https://tiktok.com/@freed',
  },
];

export default function ContactUsScreen() {
  const navigation = useNavigation();
  const colors = useThemeColors();

  return (
    <AnimatedSkyBackground>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-5 pt-4 pb-4">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: colors.elevatedBg }}
          >
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <ScreenTitle>
            Contact Us
          </ScreenTitle>
        </View>

        <View className="px-5">
          <View
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.borderColor,
              backgroundColor: colors.cardBg,
            }}
          >
            {CONTACT_LINKS.map((link, index) => (
              <View key={link.title}>
                {index > 0 && (
                  <View style={{ height: 1, backgroundColor: colors.borderColor, marginHorizontal: 16 }} />
                )}
                <Pressable
                  onPress={() => Linking.openURL(link.url)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                  }}
                >
                  <Ionicons
                    name={link.icon}
                    size={24}
                    color={colors.isDark && (link.icon === 'logo-twitter' || link.icon === 'logo-tiktok') ? '#ffffff' : link.iconColor}
                    style={{ width: 32 }}
                  />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={{ fontSize: 17, fontWeight: '600', color: colors.textPrimary }}>
                      {link.title}
                    </Text>
                    <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
                      {link.subtitle}
                    </Text>
                  </View>
                  <Ionicons name="open-outline" size={20} color={colors.textMuted} />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </AnimatedSkyBackground>
  );
}
