import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { ScreenTitle } from '@/src/components/ScreenTitle';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import type { AppStackParamList } from '@/src/navigation/types';
import { useJournalStore } from '@/src/stores/journalStore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<AppStackParamList, 'JournalDetail'>;

export default function JournalDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<Props['route']>();
  const colors = useThemeColors();
  const { entries, deleteEntry } = useJournalStore();

  const entry = entries.find((e) => e.id === route.params.entryId);

  const handleDelete = () => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this journal entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!entry) return;
          try {
            await deleteEntry(entry.id);
            navigation.goBack();
          } catch { }
        },
      },
    ]);
  };

  if (!entry) {
    return (
      <AnimatedSkyBackground>
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.textMuted, fontSize: 16 }}>Entry not found</Text>
        </SafeAreaView>
      </AnimatedSkyBackground>
    );
  }

  const cardStyle = {
    borderWidth: 1,
    borderColor: colors.isDark ? 'rgba(160,150,220,0.2)' : colors.borderColor,
    borderRadius: 20,
    backgroundColor: colors.isDark ? 'rgba(160,150,220,0.08)' : colors.cardBg,
    padding: 24,
    marginHorizontal: 20,
  };

  return (
    <AnimatedSkyBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
            <Text style={{ fontSize: 17, color: colors.isDark ? '#60a5fa' : '#3b82f6' }}>Back</Text>
          </Pressable>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <Pressable onPress={handleDelete} hitSlop={12}>
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('JournalEntry', { entryId: entry.id })}
              hitSlop={12}
            >
              <Text style={{ fontSize: 17, color: colors.isDark ? '#60a5fa' : '#3b82f6' }}>Edit</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 48 }}>
          {/* Entry Card */}
          <View style={cardStyle}>
            {entry.title ? (
              <ScreenTitle style={{ lineHeight: 40, marginBottom: 16 }}>
                {entry.title}
              </ScreenTitle>
            ) : null}

            <Text style={{ fontSize: 15, color: colors.textMuted, marginBottom: 20 }}>
              {formatDetailDate(entry.created_at)}
            </Text>

            <View style={{ height: 1, backgroundColor: colors.borderColor, marginBottom: 20 }} />

            {entry.content ? (
              <Text style={{ fontSize: 18, color: colors.textPrimary, lineHeight: 28 }}>
                {entry.content}
              </Text>
            ) : (
              <Text style={{ fontSize: 16, color: colors.textMuted, fontStyle: 'italic' }}>
                No content
              </Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </AnimatedSkyBackground>
  );
}

function formatDetailDate(dateString: string): string {
  try {
    return format(new Date(dateString), "d MMMM yyyy 'at' h:mm a");
  } catch {
    return '';
  }
}
