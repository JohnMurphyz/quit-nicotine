import { View, Text, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AppStackParamList } from '@/src/navigation/types';

type ContentDetailRoute = RouteProp<AppStackParamList, 'ContentDetail'>;

export default function ContentDetailScreen() {
  const route = useRoute<ContentDetailRoute>();
  const { slug } = route.params;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <ScrollView className="flex-1 px-4 pt-6 pb-12">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          {slug?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
        </Text>
        <View className="bg-gray-50 rounded-2xl p-6 items-center">
          <Text className="text-gray-500 text-center">
            Content for "{slug}" will be added here. This is a placeholder
            screen for the content hub.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
