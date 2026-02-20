import { useThemeColors } from '@/src/hooks/useThemeColors';
import type { Profile } from '@/src/types/database';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from 'react-native-reanimated';

interface HomeTodoCardProps {
  profile: Profile;
  notificationsEnabled: boolean;
  hasJournalEntries: boolean;
  onSetGoals: () => void;
  onTrackSymptoms: () => void;
  onEnableNotifications: () => void;
  onAddPartner: () => void;
  onDestroyProducts: () => void;
  onWriteJournal: () => void;
}

interface TodoItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  complete: boolean;
  onPress: () => void;
}

export function HomeTodoCard({
  profile,
  notificationsEnabled,
  hasJournalEntries,
  onSetGoals,
  onTrackSymptoms,
  onEnableNotifications,
  onAddPartner,
  onDestroyProducts,
  onWriteJournal,
}: HomeTodoCardProps) {
  const colors = useThemeColors();
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    setExpanded((e) => !e);
  };

  const items: TodoItem[] = [
    {
      icon: 'trophy-outline',
      title: 'Set recovery goals',
      description: 'Choose what motivates you',
      complete: (profile.motivations ?? []).length > 0,
      onPress: onSetGoals,
    },
    {
      icon: 'pulse-outline',
      title: 'Track symptoms',
      description: 'Monitor your withdrawal',
      complete: (profile.tracked_symptoms ?? []).length > 0,
      onPress: onTrackSymptoms,
    },
    {
      icon: 'notifications-outline',
      title: 'Enable notifications',
      description: 'Stay on track with reminders',
      complete: profile.push_token != null || notificationsEnabled,
      onPress: onEnableNotifications,
    },
    {
      icon: 'people-outline',
      title: 'Add accountability partner',
      description: 'Get support from someone you trust',
      complete: profile.linked_to != null,
      onPress: onAddPartner,
    },
    {
      icon: 'trash-outline',
      title: 'Destroy your products',
      description: 'Remove temptation for good',
      complete: profile.destroyed_products === true,
      onPress: onDestroyProducts,
    },
    {
      icon: 'book-outline',
      title: 'Write first journal entry',
      description: 'Start documenting your journey',
      complete: hasJournalEntries,
      onPress: onWriteJournal,
    },
  ];

  const allComplete = items.every((i) => i.complete);
  if (allComplete) return null;

  const pending = items.filter((i) => !i.complete);
  const done = items.filter((i) => i.complete);
  const visibleItems = expanded ? [...pending, ...done] : pending;

  const borderColor = colors.isDark ? 'rgba(160,150,220,0.1)' : colors.borderColor;

  return (
    <Animated.View
      layout={LinearTransition.duration(300)}
      style={{
        marginHorizontal: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: colors.isDark ? 'rgba(160,150,220,0.2)' : colors.borderColor,
        borderRadius: 16,
        backgroundColor: colors.isDark ? 'rgba(160,150,220,0.06)' : colors.cardBg,
        overflow: 'hidden',
      }}
    >
      {/* Header — tappable to expand/collapse */}
      <Pressable
        onPress={toggle}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 14,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: '700', color: colors.textPrimary }}>
            To-do
          </Text>
          {/* Remaining badge */}
          <View style={{
            backgroundColor: colors.isDark ? 'rgba(160,150,220,0.15)' : 'rgba(140,122,102,0.1)',
            borderRadius: 10,
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textSecondary }}>
              {pending.length} left
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {done.length > 0 && (
            <Text style={{ fontSize: 12, color: colors.textMuted }}>
              {done.length} done
            </Text>
          )}
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.textMuted}
          />
        </View>
      </Pressable>

      {/* Items */}
      {visibleItems.map((item) => (
        <Animated.View
          key={item.title}
          layout={LinearTransition.duration(300)}
          entering={FadeInUp.duration(300)}
          exiting={FadeOutUp.duration(200)}
        >
          <Pressable
            onPress={item.onPress}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderTopWidth: 1,
              borderTopColor: borderColor,
              opacity: item.complete ? 0.5 : 1,
            }}
          >
            {/* Icon circle */}
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.elevatedBg,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name={item.icon} size={20} color={colors.textAccent} />
            </View>

            {/* Text */}
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: item.complete ? colors.textMuted : colors.textPrimary,
                  textDecorationLine: item.complete ? 'line-through' : 'none',
                }}
              >
                {item.title}
              </Text>
              <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
                {item.description}
              </Text>
            </View>

            {/* Checkbox */}
            {item.complete ? (
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: '#22c55e',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="checkmark" size={16} color="#fff" />
              </View>
            ) : (
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: colors.isDark ? 'rgba(160,150,220,0.3)' : '#d1d5db',
                }}
              />
            )}
          </Pressable>
        </Animated.View>
      ))}

      {/* Expand footer — only show when collapsed and there are done items */}
      {!expanded && done.length > 0 && (
        <Animated.View
          layout={LinearTransition.duration(300)}
          entering={FadeInUp.duration(300)}
          exiting={FadeOutUp.duration(200)}
        >
          <Pressable
            onPress={toggle}
            style={{
              borderTopWidth: 1,
              borderTopColor: borderColor,
              paddingVertical: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 13, color: colors.textMuted, fontWeight: '600' }}>
              Show {done.length} completed
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </Animated.View>
  );
}
