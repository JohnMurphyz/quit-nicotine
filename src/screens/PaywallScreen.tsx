import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/src/components/ui/Button';

// TODO: Re-enable when RevenueCat/Stripe is configured
export default function PaywallScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-warm-50">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-bold text-warm-800 text-center mb-2">
          Subscriptions Coming Soon
        </Text>
        <Text className="text-base text-warm-400 text-center mb-8">
          Premium features will be available here. For now, enjoy full access.
        </Text>
        <Button
          title="Go Back"
          size="lg"
          onPress={() => navigation.goBack()}
        />
      </View>
    </SafeAreaView>
  );
}
