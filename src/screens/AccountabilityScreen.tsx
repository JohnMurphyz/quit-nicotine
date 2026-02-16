import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/src/lib/supabase';
import { useAuthStore } from '@/src/stores/authStore';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import type { AccountabilityPartner, Profile } from '@/src/types';

interface PartnerWithProfile extends AccountabilityPartner {
  partner_profile?: Pick<Profile, 'display_name' | 'email'>;
}

export default function AccountabilityScreen() {
  const { user } = useAuthStore();
  const [partners, setPartners] = useState<PartnerWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('accountability_partners')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching partners:', error);
      setLoading(false);
      return;
    }

    const enriched = await Promise.all(
      (data ?? []).map(async (partner) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, email')
          .eq('id', partner.partner_id)
          .single();

        return { ...partner, partner_profile: profile ?? undefined };
      })
    );

    setPartners(enriched);
    setLoading(false);
  };

  const revokePartner = async (partnerId: string) => {
    Alert.alert(
      'Revoke Access',
      'This partner will no longer be able to see your progress.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: async () => {
            await supabase
              .from('accountability_partners')
              .update({ status: 'revoked' })
              .eq('id', partnerId);

            fetchPartners();
          },
        },
      ]
    );
  };

  const activePartners = partners.filter((p) => p.status === 'active');
  const revokedPartners = partners.filter((p) => p.status === 'revoked');

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <ScrollView className="flex-1 px-4 pt-6 pb-12">
        {loading ? (
          <Text className="text-gray-500 text-center mt-8">Loading...</Text>
        ) : partners.length === 0 ? (
          <View className="items-center mt-12">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              No Partners Yet
            </Text>
            <Text className="text-gray-500 text-center">
              Share your invite link from Settings to add accountability
              partners.
            </Text>
          </View>
        ) : (
          <>
            {activePartners.length > 0 && (
              <>
                <Text className="text-sm font-medium text-gray-500 uppercase mb-2">
                  Active Partners
                </Text>
                {activePartners.map((partner) => (
                  <Card key={partner.id} className="mb-3">
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text className="text-base font-semibold text-gray-800">
                          {partner.partner_profile?.display_name ?? 'Partner'}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {partner.partner_profile?.email}
                        </Text>
                      </View>
                      <Button
                        title="Revoke"
                        variant="ghost"
                        size="sm"
                        onPress={() => revokePartner(partner.id)}
                      />
                    </View>
                  </Card>
                ))}
              </>
            )}

            {revokedPartners.length > 0 && (
              <>
                <Text className="text-sm font-medium text-gray-500 uppercase mb-2 mt-6">
                  Revoked
                </Text>
                {revokedPartners.map((partner) => (
                  <Card key={partner.id} className="mb-3 opacity-50">
                    <Text className="text-base text-gray-600">
                      {partner.partner_profile?.display_name ?? 'Partner'}
                    </Text>
                  </Card>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
