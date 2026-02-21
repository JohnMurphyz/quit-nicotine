import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Quote {
  name: string;
  avatar: string;
  title: string;
  body: string;
}

const QUOTES: Quote[] = [
  {
    name: 'Andrew Huberman, Ph.D.',
    avatar: 'https://yt3.googleusercontent.com/Y8lhyl8aHY42phxwoAwUqwLGDp-z8nmtj3Z7_JB-Oh4yIZ1OFYb-MlJRuz_oygqsYQU-VgGqiOM=s900-c-k-c0x00ffffff-no-rj',
    title: 'Drastically improve your life',
    body: 'Resetting your dopamine balance by taking a break from nicotine can dramatically improve motivation, emotional stability, and everyday pleasure.',
  },
  {
    name: 'Allen Carr',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Allen_Carr.jpeg',
    title: 'You are not giving up anything',
    body: "Get it clearly into your mind: you are not giving up anything. There is nothing to give up. There is no genuine pleasure or crutch in nicotine. It is just an illusion, like banging your head against a wall to make it feel better when you stop.",
  },
  {
    name: 'Dr. Judson Brewer',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Dr._Jud_Brewer.jpg/400px-Dr._Jud_Brewer.jpg',
    title: 'Curiosity over craving',
    body: "When a craving hits, get curious about it instead of fighting it. What does it actually feel like in your body? Curiosity naturally replaces the habitual loop of craving and reward.",
  },
  {
    name: 'Matthew Walker, Ph.D.',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Matt_Scientist_Headshot.jpg/400px-Matt_Scientist_Headshot.jpg',
    title: 'Reclaim your sleep',
    body: 'Nicotine is a stimulant that fragments your sleep architecture. Within days of quitting, your deep sleep improves dramatically — and with it, your memory, mood, and immune function.',
  },
  {
    name: 'James Clear',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/1/17/James_Clear_in_2010.jpg',
    title: 'Identity over outcomes',
    body: "Every time you resist a craving, you're casting a vote for the person you want to become. You don't need to be perfect. You just need enough votes to win the election.",
  },
  {
    name: 'Johann Hari',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Johann_Hari_%28cropped%29.jpg/400px-Johann_Hari_%28cropped%29.jpg',
    title: 'Connection is the antidote',
    body: 'The opposite of addiction is not sobriety. The opposite of addiction is connection. Build a life so full of meaning and connection that you no longer need a chemical escape.',
  },
];

export default function MotivationScreen() {
  const navigation = useNavigation();
  const colors = useThemeColors();

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
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.textPrimary }}>Motivation</Text>
        </View>

        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {QUOTES.map((quote, index) => (
            <View key={index} style={{ marginBottom: 28 }}>
              {/* Author row */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Image
                  source={{ uri: quote.avatar }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.elevatedBg,
                  }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: colors.textPrimary,
                    marginLeft: 10,
                    flex: 1,
                  }}
                >
                  {quote.name}
                </Text>
                <Ionicons name="checkmark-circle" size={18} color="#2DD4BF" />
              </View>

              {/* Quote card */}
              <View
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  borderRadius: 16,
                  padding: 18,
                  marginLeft: 50,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: colors.textPrimary,
                    marginBottom: 8,
                  }}
                >
                  {quote.title}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.textSecondary,
                  }}
                >
                  {quote.body}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </AnimatedSkyBackground>
  );
}
