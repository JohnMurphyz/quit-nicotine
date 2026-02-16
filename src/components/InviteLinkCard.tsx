import { View, Text, Alert, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { INVITE_WEB_DOMAIN } from '@/src/constants/config';

interface InviteLinkCardProps {
  inviteCode: string;
}

export function InviteLinkCard({ inviteCode }: InviteLinkCardProps) {
  const webLink = `https://${INVITE_WEB_DOMAIN}/invite/${inviteCode}`;
  const shareMessage = `Track my nicotine-free journey! Join as my accountability partner: ${webLink}`;

  const handleShare = async () => {
    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ text: shareMessage });
      } else {
        await handleCopy();
      }
      return;
    }

    await handleCopy();
  };

  const handleCopy = async () => {
    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined') {
        await navigator.clipboard.writeText(webLink);
      }
      alert('Link copied!');
    } else {
      await Clipboard.setStringAsync(webLink);
      Alert.alert('Copied!', 'Invite link copied to clipboard.');
    }
  };

  return (
    <Card className="mb-4">
      <Text className="text-base font-semibold text-gray-800 mb-2">
        Invite an Accountability Partner
      </Text>
      <Text className="text-sm text-gray-500 mb-3">
        Share this link with someone who wants to track your progress.
      </Text>
      <View className="bg-gray-50 rounded-lg p-3 mb-3">
        <Text className="text-xs text-gray-600" numberOfLines={1}>
          {webLink}
        </Text>
      </View>
      <View className="flex-row gap-2">
        <View className="flex-1">
          <Button title="Share" onPress={handleShare} size="sm" />
        </View>
        <View className="flex-1">
          <Button
            title="Copy"
            variant="outline"
            onPress={handleCopy}
            size="sm"
          />
        </View>
      </View>
    </Card>
  );
}
