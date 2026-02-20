import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import type { AppStackParamList } from '@/src/navigation/types';
import { useAuthStore } from '@/src/stores/authStore';
import { useJournalStore } from '@/src/stores/journalStore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<AppStackParamList, 'JournalEntry'>;

export default function JournalEntryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<Props['route']>();
  const colors = useThemeColors();
  const { user } = useAuthStore();
  const { entries, addEntry, updateEntry } = useJournalStore();

  const editingEntry = route.params?.entryId
    ? entries.find((e) => e.id === route.params.entryId)
    : null;

  const [title, setTitle] = useState(editingEntry?.title ?? route.params?.initialTitle ?? '');
  const [content, setContent] = useState(editingEntry?.content ?? route.params?.initialContent ?? '');

  const isEditing = !!editingEntry;
  const hasContent = title.trim().length > 0 || content.trim().length > 0;

  const handleClose = useCallback(async () => {
    if (hasContent) {
      try {
        if (isEditing && editingEntry) {
          await updateEntry(editingEntry.id, {
            title: title.trim() || undefined,
            content: content.trim() || undefined,
          });
        } else if (user?.id) {
          await addEntry(user.id, 'okay', title.trim() || undefined, content.trim() || undefined);
        }
      } catch { }
    }
    navigation.goBack();
  }, [hasContent, isEditing, editingEntry, title, content, user?.id]);

  return (
    <AnimatedSkyBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
          <Pressable onPress={handleClose} hitSlop={12}>
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </Pressable>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={{ flex: 1, paddingHorizontal: 24 }}>
            {/* Title Input */}
            <TextInput
              placeholder="Title"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
              style={{
                fontSize: 28,
                fontWeight: '700',
                color: colors.textPrimary,
                paddingVertical: 12,
              }}
              autoFocus={!isEditing}
            />

            {/* Content Input */}
            <TextInput
              placeholder="Write your thoughts..."
              placeholderTextColor={colors.textMuted}
              value={content}
              onChangeText={setContent}
              style={{
                fontSize: 18,
                color: colors.textPrimary,
                lineHeight: 28,
                flex: 1,
                textAlignVertical: 'top',
                paddingTop: 8,
              }}
              multiline
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AnimatedSkyBackground>
  );
}
