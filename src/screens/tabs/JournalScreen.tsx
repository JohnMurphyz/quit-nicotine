import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useJournal } from '@/src/hooks/useJournal';
import { useAuthStore } from '@/src/stores/authStore';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import type { AppStackParamList } from '@/src/navigation/types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

export default function JournalScreen() {
  const navigation = useNavigation<Nav>();
  const colors = useThemeColors();
  const { user } = useAuthStore();
  const { entries: rawEntries, loading, fetchEntries } = useJournal();
  const [refreshing, setRefreshing] = useState(false);

  // Filter out empty entries (no title and no content)
  const entries = useMemo(
    () => rawEntries.filter((e) => e.title?.trim() || e.content?.trim()),
    [rawEntries],
  );

  const onRefresh = useCallback(async () => {
    if (!user?.id) return;
    setRefreshing(true);
    try {
      await fetchEntries(user.id);
    } catch {}
    setRefreshing(false);
  }, [user?.id]);

  return (
    <AnimatedSkyBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </Pressable>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary }}>
            Journal
          </Text>
          <Pressable
            onPress={() => navigation.navigate('JournalEntry', {})}
            hitSlop={12}
          >
            <Ionicons name="add" size={28} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Entry List */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {entries.length === 0 && !loading ? (
            <View style={{ alignItems: 'center', paddingTop: 100, paddingHorizontal: 20 }}>
              <View style={{
                width: 80, height: 80, borderRadius: 40,
                backgroundColor: colors.isDark ? 'rgba(160,150,220,0.1)' : 'rgba(140,122,102,0.08)',
                alignItems: 'center', justifyContent: 'center', marginBottom: 20,
              }}>
                <Ionicons name="book-outline" size={36} color={colors.textMuted} />
              </View>
              <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '700', marginBottom: 8 }}>
                Your journal is empty
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 32 }}>
                Writing helps you process cravings, track patterns, and see how far you've come.
              </Text>
              <Pressable
                onPress={() => navigation.navigate('JournalEntry', {})}
                style={({ pressed }) => ({
                  marginTop: 0,
                  backgroundColor: colors.isDark ? 'rgba(160,150,220,0.15)' : 'rgba(140,122,102,0.1)',
                  borderWidth: 1,
                  borderColor: colors.isDark ? 'rgba(160,150,220,0.25)' : 'rgba(140,122,102,0.2)',
                  borderRadius: 16,
                  paddingHorizontal: 24, paddingVertical: 14,
                  flexDirection: 'row', alignItems: 'center', gap: 8,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textSecondary }}>
                  Write your first entry
                </Text>
              </Pressable>
            </View>
          ) : (
            entries.map((entry) => (
              <Pressable
                key={entry.id}
                onPress={() => navigation.navigate('JournalDetail', { entryId: entry.id })}
                style={{ paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: colors.borderColor }}
              >
                {entry.title ? (
                  <Text
                    style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 }}
                    numberOfLines={2}
                  >
                    {entry.title}
                  </Text>
                ) : null}
                {entry.content ? (
                  <Text
                    style={{ fontSize: 16, color: colors.textSecondary, lineHeight: 24 }}
                    numberOfLines={4}
                  >
                    {entry.content}
                  </Text>
                ) : null}
                <Text style={{ fontSize: 14, color: colors.textMuted, marginTop: 8 }}>
                  {formatEntryDate(entry.created_at)}
                </Text>
              </Pressable>
            ))
          )}
        </ScrollView>

        {/* Bottom New Entry Button */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingBottom: 40 }}>
          <Pressable
            onPress={() => navigation.navigate('JournalEntry', {})}
            style={({ pressed }) => ({
              backgroundColor: colors.isDark ? 'rgba(255,255,255,0.95)' : '#ffffff',
              borderRadius: 28,
              height: 56,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              opacity: pressed ? 0.85 : 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            })}
          >
            <Text style={{ fontSize: 17, fontWeight: '600', color: '#1a1a2e' }}>
              New Entry
            </Text>
            <Ionicons name="add" size={22} color="#1a1a2e" />
          </Pressable>
        </View>
      </SafeAreaView>
    </AnimatedSkyBackground>
  );
}

function formatEntryDate(dateString: string): string {
  try {
    return format(new Date(dateString), 'd MMMM yyyy');
  } catch {
    return '';
  }
}
