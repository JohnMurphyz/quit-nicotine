import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/src/hooks/useThemeColors';

interface HomeMainCardProps {
  onNavigate: (screen: string) => void;
}

interface MainItem {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  title: string;
  description: string;
  screen: string;
}

const ITEMS: MainItem[] = [
  {
    icon: 'book-outline',
    color: '#f59e0b',
    title: 'Journal',
    description: 'Reflect on your quit journey',
    screen: 'Journal',
  },
  {
    icon: 'library-outline',
    color: '#3b82f6',
    title: 'Learn',
    description: 'Articles & guides to stay strong',
    screen: 'Learn',
  },
  {
    icon: 'people-outline',
    color: '#10b981',
    title: 'Accountability',
    description: 'Partner up for support',
    screen: 'Accountability',
  },
  {
    icon: 'trending-up-outline',
    color: '#8b5cf6',
    title: 'Recovery',
    description: 'Track your health milestones',
    screen: 'Timeline',
  },
  {
    icon: 'settings-outline',
    color: '#64748b',
    title: 'Settings',
    description: 'Profile & preferences',
    screen: 'Settings',
  },
];

export function HomeMainCard({ onNavigate }: HomeMainCardProps) {
  const colors = useThemeColors();

  return (
    <View
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
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 12,
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: '700', color: colors.textPrimary }}>
          Main
        </Text>
      </View>

      {/* Items */}
      {ITEMS.map((item) => (
        <Pressable
          key={item.title}
          onPress={() => onNavigate(item.screen)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderTopWidth: 1,
            borderTopColor: colors.isDark ? 'rgba(160,150,220,0.1)' : colors.borderColor,
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
            <Ionicons name={item.icon} size={20} color={item.color} />
          </View>

          {/* Text */}
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>
              {item.title}
            </Text>
            <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
              {item.description}
            </Text>
          </View>

          {/* Chevron */}
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </Pressable>
      ))}
    </View>
  );
}
