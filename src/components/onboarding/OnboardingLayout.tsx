import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from './ProgressBar';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  step?: number;
  totalSteps?: number;
  companionMessage?: string;
  onBack?: () => void;
  footer?: React.ReactNode;
  scrollable?: boolean;
}

export function OnboardingLayout({
  children,
  step,
  totalSteps = 8,
  companionMessage,
  onBack,
  footer,
  scrollable = false,
}: OnboardingLayoutProps) {
  const content = scrollable ? (
    <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <View className="flex-1">{children}</View>
  );

  return (
    <SafeAreaView className="flex-1 bg-warm-50">
      {step != null ? (
        <ProgressBar step={step} totalSteps={totalSteps} onBack={onBack} />
      ) : onBack ? (
        <View className="px-5 pt-2 pb-4">
          <Pressable onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color="#8c7a66" />
          </Pressable>
        </View>
      ) : null}
      {companionMessage && (
        <View className="flex-row items-center px-6 mb-4">
          <View className="w-6 h-6 rounded-full bg-warm-500 mr-2" />
          <Text className="text-sm text-warm-500">{companionMessage}</Text>
        </View>
      )}
      {content}
      {footer && <View className="px-6 pb-6">{footer}</View>}
    </SafeAreaView>
  );
}
