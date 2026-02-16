import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@/src/stores/authStore';
import { useSubscriptionStore } from '@/src/stores/subscriptionStore';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export default function PaywallScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { purchaseMobile, purchaseWeb, restorePurchases, loading } =
    useSubscriptionStore();
  const [packages, setPackages] = useState<any[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    if (Platform.OS === 'web') {
      setLoadingPackages(false);
      return;
    }

    try {
      const { getOfferings } = await import('@/src/lib/revenueCat');
      const pkgs = await getOfferings();
      setPackages(pkgs);
    } catch (error) {
      console.error('Error loading offerings:', error);
    } finally {
      setLoadingPackages(false);
    }
  };

  const handlePurchase = async (packageId?: string) => {
    if (!user?.id) return;

    try {
      if (Platform.OS === 'web') {
        await purchaseWeb(user.id, 'price_XXXXX');
      } else if (packageId) {
        await purchaseMobile(packageId);
        navigation.goBack();
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
    }
  };

  const handleRestore = async () => {
    await restorePurchases();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-6"
        contentContainerClassName="pt-8 pb-12"
      >
        <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
          Unlock Your Journey
        </Text>
        <Text className="text-base text-gray-500 text-center mb-8">
          Get full access to streak tracking, accountability partners, and all
          content.
        </Text>

        {/* Benefits */}
        <Card className="mb-6">
          {[
            'Daily streak tracking & calendar',
            'Accountability partner invites',
            'Full content library',
            'Push notification reminders',
          ].map((benefit, i) => (
            <View key={i} className="flex-row items-center mb-2 last:mb-0">
              <Text className="text-primary-500 mr-2">✓</Text>
              <Text className="text-gray-700">{benefit}</Text>
            </View>
          ))}
        </Card>

        {loadingPackages ? (
          <ActivityIndicator size="large" color="#16a34a" className="my-8" />
        ) : Platform.OS === 'web' ? (
          <Button
            title="Subscribe - $4.99/month"
            onPress={() => handlePurchase()}
            loading={loading}
            size="lg"
          />
        ) : packages.length > 0 ? (
          <View className="gap-3">
            {packages.map((pkg: any) => (
              <Button
                key={pkg.identifier}
                title={`${pkg.product.title} - ${pkg.product.priceString}`}
                onPress={() => handlePurchase(pkg.identifier)}
                loading={loading}
                size="lg"
              />
            ))}
          </View>
        ) : (
          <View className="items-center py-4">
            <Text className="text-gray-500">
              No subscription packages available.
            </Text>
          </View>
        )}

        {Platform.OS !== 'web' && (
          <Button
            title="Restore Purchases"
            variant="ghost"
            onPress={handleRestore}
            loading={loading}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
