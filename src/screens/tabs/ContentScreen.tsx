import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card } from '@/src/components/ui/Card';
import type { AppStackParamList } from '@/src/navigation/types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const CONTENT_ITEMS = [
  {
    slug: 'why-quit',
    title: 'Why Quit Nicotine?',
    description: 'Understanding the health benefits of quitting.',
    category: 'Education',
  },
  {
    slug: 'cravings',
    title: 'Managing Cravings',
    description: 'Practical tips for handling nicotine cravings.',
    category: 'Tips',
  },
  {
    slug: 'timeline',
    title: 'Recovery Timeline',
    description: 'What happens to your body after you quit.',
    category: 'Education',
  },
  {
    slug: 'triggers',
    title: 'Identifying Triggers',
    description: 'Recognize and manage your nicotine triggers.',
    category: 'Tips',
  },
  {
    slug: 'support',
    title: 'Building Support',
    description: 'How to build a support network for quitting.',
    category: 'Community',
  },
];

export default function ContentScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 pt-6 pb-12">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Content Hub
        </Text>
        <Text className="text-base text-gray-500 mb-6">
          Resources to support your journey.
        </Text>

        {CONTENT_ITEMS.map((item) => (
          <Pressable
            key={item.slug}
            onPress={() => navigation.navigate('ContentDetail', { slug: item.slug })}
          >
            <Card className="mb-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-xs font-medium text-primary-600 uppercase mb-1">
                    {item.category}
                  </Text>
                  <Text className="text-base font-semibold text-gray-800">
                    {item.title}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {item.description}
                  </Text>
                </View>
                <Text className="text-gray-400 text-lg ml-2">›</Text>
              </View>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
