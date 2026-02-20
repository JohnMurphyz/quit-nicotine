import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useAuthStore } from '@/src/stores/authStore';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { AchievementOverlay } from '@/src/components/AchievementOverlay';

const GIF_URL = 'https://media1.tenor.com/m/Yug_NJNP4UoAAAAd/lord-of-the-rings-destroy-it.gif';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DestroyProductsScreen() {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const { updateProfile } = useAuthStore();
  const [showCongrats, setShowCongrats] = useState(false);

  const handleDestroyed = async () => {
    try {
      await updateProfile({ destroyed_products: true });
    } catch {}
    setShowCongrats(true);
  };

  return (
    <>
    <AchievementOverlay
      visible={showCongrats}
      onClose={() => navigation.goBack()}
      iconName="flame"
      title="You're free."
      description="That took courage. The temptation is gone and so is the old you. Your journey starts now."
    />
    <AnimatedSkyBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* GIF + text — upper portion */}
        <View style={{ alignItems: 'center', paddingHorizontal: 24, marginTop: 46 }}>
          <View style={{
            borderRadius: 16,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.isDark ? 'rgba(160,150,220,0.2)' : colors.borderColor,
            marginBottom: 32,
          }}>
            <Image
              source={{ uri: GIF_URL }}
              style={{ width: SCREEN_WIDTH - 48, height: (SCREEN_WIDTH - 48) / 2.4 }}
              resizeMode="cover"
            />
          </View>

          <Text style={{
            fontSize: 24,
            fontWeight: '800',
            color: colors.textPrimary,
            textAlign: 'center',
            marginBottom: 8,
          }}>
            Destroy it!
          </Text>
          <Text style={{
            fontSize: 16,
            color: colors.textMuted,
            textAlign: 'center',
            lineHeight: 24,
          }}>
            Throw away every pack, pod, and tin.{'\n'}Remove all temptation.
          </Text>
        </View>

        <View style={{ flex: 1 }} />

        {/* Buttons — stacked at bottom */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 46, gap: 12 }}>
          <TouchableOpacity
            onPress={handleDestroyed}
            activeOpacity={0.8}
            style={{
              borderRadius: 14,
              paddingVertical: 17,
              alignItems: 'center',
              backgroundColor: colors.textSecondary,
              borderWidth: 2,
              borderColor: colors.textSecondary,
            }}
          >
            <Text style={{ color: colors.textPrimary, fontSize: 17, fontWeight: '700', letterSpacing: 0.2 }}>
              It's done. We're free.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={{
              borderRadius: 14,
              paddingVertical: 17,
              alignItems: 'center',
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderColor: colors.textMuted,
            }}
          >
            <Text style={{ color: colors.textMuted, fontSize: 17, fontWeight: '700', letterSpacing: 0.2 }}>
              No
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </AnimatedSkyBackground>
    </>
  );
}
