import { View, Text, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useReasonStore } from '@/src/stores/reasonStore';
import { useAuthStore } from '@/src/stores/authStore';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import type { Reason } from '@/src/types';

const REASON_EMOJIS = ['💪', '❤️', '🌟', '🧠', '🕊️', '⚡', '🌱', '🔥', '✨', '🎯', '🏔️', '🌊', '🦋', '💎', '🌻'];

function nextEmoji(existingReasons: Reason[]): string {
  const used = new Set(existingReasons.map((r) => r.emoji));
  return REASON_EMOJIS.find((e) => !used.has(e)) ?? REASON_EMOJIS[existingReasons.length % REASON_EMOJIS.length];
}

function cycleEmoji(current: string): string {
  const idx = REASON_EMOJIS.indexOf(current);
  return REASON_EMOJIS[(idx + 1) % REASON_EMOJIS.length];
}

export default function ReasonsScreen() {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const { user } = useAuthStore();
  const { reasons, loading, fetchReasons, addReason, updateReason, deleteReason } = useReasonStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState('');
  const [newEmoji, setNewEmoji] = useState('💪');
  const newInputRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const pendingEditRef = useRef<{ id: string; text: string; original: string } | null>(null);
  const pendingNewRef = useRef<{ text: string; emoji: string } | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchReasons(user.id).catch(() => {});
    }
  }, [user?.id]);

  const savePendingEdit = useCallback(async () => {
    const pending = pendingEditRef.current;
    if (pending) {
      pendingEditRef.current = null;
      const trimmed = pending.text.trim();
      if (!trimmed) {
        try { await deleteReason(pending.id); } catch {}
      } else if (trimmed !== pending.original) {
        try { await updateReason(pending.id, { content: trimmed }); } catch {}
      }
    }
    const pendingNew = pendingNewRef.current;
    if (pendingNew) {
      pendingNewRef.current = null;
      if (pendingNew.text.trim() && user?.id) {
        try { await addReason(user.id, pendingNew.text.trim(), pendingNew.emoji); } catch {}
      }
    }
  }, [user?.id]);

  // Keep refs in sync with state
  useEffect(() => {
    if (editingId) {
      const reason = reasons.find(r => r.id === editingId);
      pendingEditRef.current = { id: editingId, text: editText, original: reason?.content ?? '' };
    } else {
      pendingEditRef.current = null;
    }
  }, [editingId, editText]);

  useEffect(() => {
    if (isAdding) {
      pendingNewRef.current = { text: newText, emoji: newEmoji };
    } else {
      pendingNewRef.current = null;
    }
  }, [isAdding, newText, newEmoji]);

  const handleNewBlur = useCallback(async () => {
    const pending = pendingNewRef.current;
    pendingNewRef.current = null;
    if (pending?.text.trim() && user?.id) {
      try {
        await addReason(user.id, pending.text.trim(), pending.emoji);
      } catch {}
    }
    setNewText('');
    setIsAdding(false);
  }, [user?.id]);

  const handleEditBlur = useCallback(async (reason: Reason) => {
    const pending = pendingEditRef.current;
    pendingEditRef.current = null;
    if (!pending) return;
    const trimmed = pending.text.trim();
    if (!trimmed) {
      try { await deleteReason(reason.id); } catch {}
    } else if (trimmed !== reason.content) {
      try { await updateReason(reason.id, { content: trimmed }); } catch {}
    }
    setEditingId(null);
    setEditText('');
  }, []);

  const handleEmojiTap = async (reason: Reason) => {
    const next = cycleEmoji(reason.emoji);
    try { await updateReason(reason.id, { emoji: next }); } catch {}
  };

  const dismissAndSave = useCallback(async () => {
    Keyboard.dismiss();
    await savePendingEdit();
    setEditingId(null);
    setEditText('');
    setNewText('');
    setIsAdding(false);
  }, [savePendingEdit]);

  const startEditing = async (reason: Reason) => {
    if (editingId === reason.id) return;
    await savePendingEdit();
    setIsAdding(false);
    setNewText('');
    setEditingId(reason.id);
    setEditText(reason.content);
  };

  const startAdding = async () => {
    await savePendingEdit();
    setEditingId(null);
    setEditText('');
    setNewEmoji(nextEmoji(reasons));
    setIsAdding(true);
    setTimeout(() => {
      newInputRef.current?.focus();
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 150);
  };

  const cardStyle = {
    borderWidth: 1,
    borderColor: colors.isDark ? 'rgba(160,150,220,0.15)' : colors.borderColor,
    borderRadius: 16,
    backgroundColor: colors.isDark ? 'rgba(160,150,220,0.06)' : colors.cardBg,
    padding: 20,
    marginBottom: 12,
  };

  return (
    <AnimatedSkyBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </Pressable>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary }}>
            Reasons for Change
          </Text>
          <Pressable onPress={startAdding} hitSlop={12}>
            <Ionicons name="add" size={28} color={colors.textPrimary} />
          </Pressable>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            ref={scrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120, flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={dismissAndSave}
          >
          <Pressable style={{ flexGrow: 1 }} onPress={dismissAndSave}>
            {/* Empty state */}
            {reasons.length === 0 && !loading && !isAdding && (
              <View style={{ alignItems: 'center', paddingTop: 80, paddingHorizontal: 20 }}>
                <View style={{
                  width: 80, height: 80, borderRadius: 40,
                  backgroundColor: colors.isDark ? 'rgba(160,150,220,0.1)' : 'rgba(140,122,102,0.08)',
                  alignItems: 'center', justifyContent: 'center', marginBottom: 20,
                }}>
                  <Ionicons name="heart-outline" size={36} color={colors.textMuted} />
                </View>
                <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '700', marginBottom: 8 }}>
                  Why are you quitting?
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 32 }}>
                  Write down the reasons that matter to you. Come back and read them when you need strength.
                </Text>
                <Pressable
                  onPress={startAdding}
                  style={({ pressed }) => ({
                    backgroundColor: colors.isDark ? 'rgba(160,150,220,0.15)' : 'rgba(140,122,102,0.1)',
                    borderWidth: 1,
                    borderColor: colors.isDark ? 'rgba(160,150,220,0.25)' : 'rgba(140,122,102,0.2)',
                    borderRadius: 16,
                    paddingHorizontal: 24, paddingVertical: 14,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textSecondary }}>
                    Add your first reason
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Reasons list */}
            {reasons.map((reason) => (
              <Pressable
                key={reason.id}
                onPress={() => startEditing(reason)}
                style={cardStyle}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
                  <Pressable onPress={() => handleEmojiTap(reason)}>
                    <Text style={{ fontSize: 28, marginTop: -2 }}>
                      {reason.emoji}
                    </Text>
                  </Pressable>
                  {editingId === reason.id ? (
                    <TextInput
                      value={editText}
                      onChangeText={setEditText}
                      onBlur={() => handleEditBlur(reason)}
                      style={{
                        fontSize: 17,
                        color: colors.textPrimary,
                        lineHeight: 26,
                        flex: 1,
                        textAlignVertical: 'top',
                        minHeight: 52,
                      }}
                      multiline
                      autoFocus
                    />
                  ) : (
                    <Text style={{
                      fontSize: 17,
                      color: colors.textPrimary,
                      lineHeight: 26,
                      flex: 1,
                    }}>
                      {reason.content}
                    </Text>
                  )}
                </View>
              </Pressable>
            ))}

            {/* New reason input — at the bottom */}
            {isAdding && (
              <View style={cardStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
                  <Pressable onPress={() => setNewEmoji(cycleEmoji(newEmoji))}>
                    <Text style={{ fontSize: 28, marginTop: -2 }}>
                      {newEmoji}
                    </Text>
                  </Pressable>
                  <TextInput
                    ref={newInputRef}
                    placeholder="Why are you making this change?"
                    placeholderTextColor={colors.textMuted}
                    value={newText}
                    onChangeText={setNewText}
                    onBlur={handleNewBlur}
                    style={{
                      fontSize: 17,
                      color: colors.textPrimary,
                      lineHeight: 26,
                      flex: 1,
                      textAlignVertical: 'top',
                      minHeight: 52,
                    }}
                    multiline
                    autoFocus
                  />
                </View>
              </View>
            )}
          </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AnimatedSkyBackground>
  );
}
