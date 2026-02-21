import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { ArticleCard } from '@/src/components/ArticleCard';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import type { AppStackParamList } from '@/src/navigation/types';
import { CONTENT_ITEMS } from '@/src/screens/tabs/ContentScreen';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Nav = NativeStackNavigationProp<AppStackParamList>;

interface Article {
  slug: string;
  title: string;
  exists: boolean;
}

interface Category {
  name: string;
  color: string;
  articles: Article[];
}

const CATEGORIES: Category[] = [
  {
    name: 'Understanding Addiction',
    color: '#f97316',
    articles: [
      { slug: 'why-quit', title: 'Why Quit Nicotine?', exists: true },
      { slug: 'law-of-addiction', title: 'The Law of Addiction', exists: true },
      { slug: 'chemistry', title: 'The Chemistry of Dependence', exists: true },
    ],
  },
  {
    name: 'Managing Cravings',
    color: '#ec4899',
    articles: [
      { slug: 'cravings', title: 'Managing Cravings', exists: true },
      { slug: 'triggers', title: 'Identifying Triggers', exists: true },
      { slug: 'habit-loops', title: 'Breaking Habit Loops', exists: true },
    ],
  },
  {
    name: 'Health & Recovery',
    color: '#8b5cf6',
    articles: [
      { slug: 'timeline', title: 'Recovery Timeline', exists: true },
      { slug: 'healing', title: 'Physical Healing Milestones', exists: true },
      { slug: 'sleep-energy', title: 'Sleep & Energy Recovery', exists: true },
    ],
  },
  {
    name: 'Support & Mindset',
    color: '#3b82f6',
    articles: [
      { slug: 'support', title: 'Building Support', exists: true },
      { slug: 'freedom', title: 'The Freedom Mindset', exists: true },
      { slug: 'staying-quit', title: 'Staying Quit Long-Term', exists: true },
    ],
  },
];

export default function ArticlesScreen() {
  const navigation = useNavigation<Nav>();
  const colors = useThemeColors();

  const existingSlugs = new Set(CONTENT_ITEMS.map((item) => item.slug));

  const handleArticlePress = (article: Article) => {
    if (article.exists && existingSlugs.has(article.slug)) {
      navigation.navigate('ContentDetail', { slug: article.slug });
    } else {
      Alert.alert('Coming Soon', 'This article is coming in a future update.');
    }
  };

  const getCategoryProgress = (category: Category) => {
    const existing = category.articles.filter(
      (a) => a.exists && existingSlugs.has(a.slug),
    ).length;
    return Math.round((existing / category.articles.length) * 100);
  };

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
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.textPrimary }}>Articles</Text>
        </View>

        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {CATEGORIES.map((category) => (
            <View key={category.name} className="mb-8">
              {/* Category Header */}
              <View className="flex-row items-center justify-between mb-3">
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>
                  {category.name}
                </Text>
                <Text className="text-sm" style={{ color: category.color }}>
                  {getCategoryProgress(category)}% Complete
                </Text>
              </View>

              {/* Horizontal Article Cards */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
              >
                {category.articles.map((article, index) => (
                  <ArticleCard
                    key={article.slug}
                    title={article.title}
                    categoryName={category.name}
                    index={index}
                    isCompleted={article.exists && existingSlugs.has(article.slug)}
                    onPress={() => handleArticlePress(article)}
                  />
                ))}
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </AnimatedSkyBackground>
  );
}
