import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Line, Path } from 'react-native-svg';

type CardType = 'articles' | 'relaxation' | 'breathe' | 'journal' | 'motivation';

interface LibraryCardProps {
    type: CardType;
    title: string;
    onPress: () => void;
    index: number;
}

const CARD_CONFIG = {
    articles: {
        accentColor: '#F6A623',
        tint: 'rgba(246,166,35,0.22)',
        icon: 'document-text-outline' as const,
        renderDecor: (color: string) => (
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                {/* Stacked page lines */}
                <Line x1="65%" y1="20%" x2="92%" y2="20%" stroke={color} strokeWidth="2" opacity={0.3} strokeLinecap="round" />
                <Line x1="60%" y1="38%" x2="95%" y2="38%" stroke={color} strokeWidth="2" opacity={0.2} strokeLinecap="round" />
                <Line x1="68%" y1="56%" x2="90%" y2="56%" stroke={color} strokeWidth="2" opacity={0.15} strokeLinecap="round" />
                <Line x1="62%" y1="74%" x2="88%" y2="74%" stroke={color} strokeWidth="2" opacity={0.1} strokeLinecap="round" />
                <Circle cx="95%" cy="75%" r="12" fill={color} opacity={0.08} />
            </Svg>
        ),
    },
    relaxation: {
        accentColor: '#C78BFA',
        tint: 'rgba(139,92,246,0.22)',
        icon: 'moon-outline' as const,
        renderDecor: (color: string) => (
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                {/* Crescent moon + stars */}
                <Circle cx="78%" cy="50%" r="14" fill={color} opacity={0.15} />
                <Circle cx="82%" cy="42%" r="12" fill="rgba(13,11,46,0.9)" />
                <Circle cx="68%" cy="25%" r="2" fill={color} opacity={0.35} />
                <Circle cx="90%" cy="30%" r="1.5" fill={color} opacity={0.25} />
                <Circle cx="62%" cy="70%" r="1.5" fill={color} opacity={0.2} />
                <Circle cx="95%" cy="65%" r="2" fill={color} opacity={0.3} />
            </Svg>
        ),
    },
    breathe: {
        accentColor: '#E8845C',
        tint: 'rgba(232,132,92,0.22)',
        icon: 'leaf-outline' as const,
        renderDecor: (color: string) => (
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                {/* Concentric breath rings */}
                <Circle cx="80%" cy="50%" r="24" fill="none" stroke={color} strokeWidth="1.5" opacity={0.1} />
                <Circle cx="80%" cy="50%" r="16" fill="none" stroke={color} strokeWidth="1.5" opacity={0.18} />
                <Circle cx="80%" cy="50%" r="8" fill="none" stroke={color} strokeWidth="1.5" opacity={0.25} />
                <Circle cx="80%" cy="50%" r="3" fill={color} opacity={0.2} />
            </Svg>
        ),
    },
    journal: {
        accentColor: '#22D3EE',
        tint: 'rgba(34,211,238,0.22)',
        icon: 'journal-outline' as const,
        renderDecor: (color: string) => (
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                {/* Wavy sound / water lines */}
                <Path d="M60,20 Q70,14 80,20 T100,20 T120,20 T140,20" fill="none" stroke={color} strokeWidth="1.5" opacity={0.25} />
                <Path d="M55,32 Q67,25 79,32 T103,32 T127,32 T151,32" fill="none" stroke={color} strokeWidth="1.5" opacity={0.18} />
                <Path d="M62,44 Q72,38 82,44 T102,44 T122,44 T142,44" fill="none" stroke={color} strokeWidth="1.5" opacity={0.12} />
            </Svg>
        ),
    },
    motivation: {
        accentColor: '#F472B6',
        tint: 'rgba(244,114,182,0.22)',
        icon: 'flame-outline' as const,
        renderDecor: (color: string) => (
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                {/* Rising flame / spark shapes */}
                <Ellipse cx="82%" cy="65%" rx="8" ry="14" fill={color} opacity={0.12} />
                <Ellipse cx="82%" cy="55%" rx="5" ry="10" fill={color} opacity={0.18} />
                <Circle cx="75%" cy="30%" r="2" fill={color} opacity={0.3} />
                <Circle cx="88%" cy="22%" r="1.5" fill={color} opacity={0.2} />
                <Circle cx="80%" cy="15%" r="1" fill={color} opacity={0.15} />
            </Svg>
        ),
    },
};

export function LibraryCard({ type, title, onPress, index }: LibraryCardProps) {
    const config = CARD_CONFIG[type];

    return (
        <Animated.View entering={FadeInDown.delay(100 + index * 100).duration(600).easing(Easing.out(Easing.cubic))} style={{ flex: 1 }}>
            <Pressable
                onPress={onPress}
                style={({ pressed }) => ({
                    flex: 1,
                    width: '100%',
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                })}
            >
                <View
                    style={{
                        flex: 1,
                        width: '100%',
                        height: 64,
                        borderRadius: 16,
                        overflow: 'hidden',
                        paddingHorizontal: 18,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: config.tint,
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.1)',
                    }}
                >
                    <View style={{ ...StyleSheet.absoluteFillObject }}>
                        {config.renderDecor(config.accentColor)}
                    </View>

                    <Ionicons name={config.icon} size={20} color={config.accentColor} />

                    <Text
                        style={{
                            flex: 1,
                            color: 'white',
                            fontSize: 15,
                            fontWeight: '700',
                            letterSpacing: 0.3,
                            marginLeft: 12,
                        }}
                    >
                        {title}
                    </Text>

                    <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.4)" />
                </View>
            </Pressable>
        </Animated.View>
    );
}
