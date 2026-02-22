import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { ScreenTitle } from '@/src/components/ScreenTitle';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { supabase } from '@/src/lib/supabase';
import { useAuthStore } from '@/src/stores/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FeedbackScreen() {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const { user } = useAuthStore();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim() || !user?.id) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({ user_id: user.id, message: message.trim() });

      if (error) throw error;

      // Also open mailto so the user can send via email
      const subject = encodeURIComponent('FREED Feedback');
      const body = encodeURIComponent(message.trim());
      Linking.openURL(`mailto:feedback@freed.app?subject=${subject}&body=${body}`);

      setSubmitted(true);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Could not submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <AnimatedSkyBackground>
        <SafeAreaView className="flex-1">
          <View className="flex-row items-center px-5 pt-4 pb-4">
            <Pressable
              onPress={() => navigation.goBack()}
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: colors.elevatedBg }}
            >
              <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
            </Pressable>
            <ScreenTitle>
              Give Feedback
            </ScreenTitle>
          </View>

          <View className="flex-1 items-center justify-center px-5" style={{ marginTop: -60 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#22c55e20',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <Ionicons name="checkmark-circle" size={48} color="#22c55e" />
            </View>
            <Text style={{ fontSize: 24, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 }}>
              Thank you!
            </Text>
            <Text style={{ fontSize: 16, color: colors.textMuted, textAlign: 'center', marginBottom: 32 }}>
              Your feedback helps us make FREED better for everyone.
            </Text>
            <Pressable
              onPress={() => navigation.goBack()}
              style={{
                backgroundColor: colors.isDark ? '#ffffff' : '#362d23',
                borderRadius: 30,
                paddingVertical: 14,
                paddingHorizontal: 48,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.isDark ? '#0f0d2e' : '#ffffff' }}>
                Done
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </AnimatedSkyBackground>
    );
  }

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
            Give Feedback
          </ScreenTitle>
        </View>

        <View className="flex-1 px-5">
          <View
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.borderColor,
              backgroundColor: colors.cardBg,
              padding: 16,
            }}
          >
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Tell us what you think — what's working, what could be better, or any ideas you have..."
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
              style={{
                fontSize: 16,
                color: colors.textPrimary,
                minHeight: 200,
                lineHeight: 24,
              }}
            />
          </View>

          <Pressable
            onPress={handleSubmit}
            disabled={!message.trim() || submitting}
            style={{
              backgroundColor: !message.trim() || submitting
                ? (colors.isDark ? '#ffffff30' : '#362d2340')
                : (colors.isDark ? '#ffffff' : '#362d23'),
              borderRadius: 30,
              paddingVertical: 16,
              alignItems: 'center',
              marginTop: 20,
            }}
          >
            {submitting ? (
              <ActivityIndicator color={colors.isDark ? '#0f0d2e' : '#ffffff'} />
            ) : (
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.isDark ? '#0f0d2e' : '#ffffff' }}>
                Submit Feedback
              </Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </AnimatedSkyBackground>
  );
}
