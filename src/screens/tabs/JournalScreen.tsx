import { View, Text, ScrollView, TextInput, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useJournal } from '@/src/hooks/useJournal';
import { useCravings } from '@/src/hooks/useCravings';
import { useAuthStore } from '@/src/stores/authStore';
import { MoodSelector, getMoodEmoji } from '@/src/components/MoodSelector';
import { Card } from '@/src/components/ui/Card';
import type { Mood } from '@/src/types';
import type { AppStackParamList } from '@/src/navigation/types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

type Tab = 'reflections' | 'cravings';

export default function JournalScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuthStore();
  const { entries, loading: journalLoading, saving, addEntry, fetchEntries } = useJournal();
  const { cravings, loading: cravingsLoading, markResisted, fetchCravings } = useCravings();

  const [activeTab, setActiveTab] = useState<Tab>('reflections');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    if (!user?.id) return;
    setRefreshing(true);
    try {
      await Promise.all([
        fetchEntries(user.id),
        fetchCravings(user.id),
      ]);
    } catch {}
    setRefreshing(false);
  }, [user?.id]);

  const handleSubmitReflection = async () => {
    if (!selectedMood) return;
    await addEntry(selectedMood, reflectionText.trim() || undefined);
    setSelectedMood(null);
    setReflectionText('');
  };

  return (
    <SafeAreaView className="flex-1 bg-warm-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-6 pb-12"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text className="text-2xl font-bold text-warm-800 mb-4">Journal</Text>

        {/* Tab Switcher */}
        <View className="flex-row bg-warm-200 rounded-xl p-1 mb-6">
          <Pressable
            onPress={() => setActiveTab('reflections')}
            className={`flex-1 py-2 rounded-lg items-center ${
              activeTab === 'reflections' ? 'bg-warm-50 shadow-sm' : ''
            }`}
          >
            <Text
              className={`font-medium ${
                activeTab === 'reflections' ? 'text-warm-800' : 'text-warm-400'
              }`}
            >
              Reflections
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('cravings')}
            className={`flex-1 py-2 rounded-lg items-center ${
              activeTab === 'cravings' ? 'bg-warm-50 shadow-sm' : ''
            }`}
          >
            <Text
              className={`font-medium ${
                activeTab === 'cravings' ? 'text-warm-800' : 'text-warm-400'
              }`}
            >
              Cravings ({cravings.length})
            </Text>
          </Pressable>
        </View>

        {activeTab === 'reflections' ? (
          <>
            {/* New Reflection */}
            <Card className="mb-6">
              <Text className="text-base font-semibold text-warm-800 mb-3">
                How are you feeling today?
              </Text>
              <MoodSelector selected={selectedMood} onSelect={setSelectedMood} />
              {selectedMood && (
                <View className="mt-3">
                  <TextInput
                    placeholder="Write a reflection (optional)"
                    value={reflectionText}
                    onChangeText={setReflectionText}
                    className="border border-warm-200 rounded-xl p-3 text-base text-warm-700 mb-3"
                    placeholderTextColor="#b09a82"
                    multiline
                    numberOfLines={3}
                  />
                  <Pressable
                    onPress={handleSubmitReflection}
                    disabled={saving}
                    className="bg-warm-700 active:bg-warm-800 rounded-xl py-3 items-center"
                  >
                    <Text className="text-white font-semibold">
                      {saving ? 'Saving...' : 'Save Entry'}
                    </Text>
                  </Pressable>
                </View>
              )}
            </Card>

            {/* Past Entries */}
            {entries.length === 0 && !journalLoading ? (
              <View className="items-center py-8">
                <Ionicons name="book-outline" size={48} color="#d4c4b0" />
                <Text className="text-warm-400 mt-2">No journal entries yet</Text>
                <Text className="text-warm-400 text-sm">
                  Select a mood above to get started
                </Text>
              </View>
            ) : (
              entries.map((entry) => (
                <Card key={entry.id} className="mb-3">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-xl">{getMoodEmoji(entry.mood)}</Text>
                    <Text className="text-xs text-warm-400">
                      {formatDate(entry.created_at)}
                    </Text>
                  </View>
                  {entry.content ? (
                    <Text className="text-warm-600 mt-1">{entry.content}</Text>
                  ) : null}
                </Card>
              ))
            )}
          </>
        ) : (
          <>
            {/* Cravings List */}
            {cravings.length === 0 && !cravingsLoading ? (
              <View className="items-center py-8">
                <Ionicons name="flash-outline" size={48} color="#d4c4b0" />
                <Text className="text-warm-400 mt-2">No cravings logged yet</Text>
                <Text className="text-warm-400 text-sm">
                  Log cravings from the Home tab
                </Text>
              </View>
            ) : (
              cravings.map((craving) => (
                <Card key={craving.id} className="mb-3">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <Ionicons
                        name="flash"
                        size={20}
                        color={craving.resisted ? '#6b5d4e' : '#f59e0b'}
                      />
                      <View>
                        {craving.intensity != null && (
                          <Text className="text-sm font-medium text-warm-800">
                            Intensity: {craving.intensity}/10
                          </Text>
                        )}
                        {craving.trigger && (
                          <Text className="text-sm text-warm-400 capitalize">
                            {craving.trigger.replace('_', ' ')}
                          </Text>
                        )}
                        {!craving.intensity && !craving.trigger && (
                          <Text className="text-sm text-warm-400">Quick log</Text>
                        )}
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-xs text-warm-400">
                        {formatDate(craving.created_at)}
                      </Text>
                      {craving.resisted ? (
                        <Text className="text-xs text-warm-600 font-medium">
                          Resisted
                        </Text>
                      ) : (
                        <Pressable
                          onPress={() => markResisted(craving.id)}
                          className="mt-1"
                        >
                          <Text className="text-xs text-amber-600 font-medium">
                            Mark resisted
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                  {craving.note ? (
                    <Text className="text-warm-500 text-sm mt-2">{craving.note}</Text>
                  ) : null}
                </Card>
              ))
            )}

            {/* SOS Button */}
            <Pressable
              onPress={() => navigation.navigate('CravingSOS')}
              className="bg-red-50 rounded-2xl p-4 mt-2 flex-row items-center justify-center"
            >
              <Ionicons name="alert-circle" size={24} color="#ef4444" />
              <Text className="text-red-600 font-semibold ml-2">
                Need help? Open SOS
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), 'MMM d, h:mm a');
  } catch {
    return '';
  }
}
