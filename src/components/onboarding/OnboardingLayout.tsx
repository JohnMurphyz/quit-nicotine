import { View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { ProgressBar } from './ProgressBar';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  step?: number;
  totalSteps?: number;
  onBack?: () => void;
  footer?: React.ReactNode;
  scrollable?: boolean;
}

export function OnboardingLayout({
  children,
  step,
  totalSteps = 7,
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
    <AnimatedSkyBackground>
      <SafeAreaView className="flex-1">
        {step != null ? (
          <ProgressBar step={step} totalSteps={totalSteps} onBack={onBack} />
        ) : onBack ? (
          <View className="px-5 pt-2 pb-4">
            <Pressable onPress={onBack}>
              <Ionicons name="chevron-back" size={24} color="#c4b5fd" />
            </Pressable>
          </View>
        ) : null}
        {content}
        {footer && <View className="px-6 pb-6">{footer}</View>}
      </SafeAreaView>
    </AnimatedSkyBackground>
  );
}
