import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import Svg, { Circle, Path, Polygon } from 'react-native-svg';

type CardType = 'articles' | 'relaxation' | 'breathe' | 'journal' | 'motivation';

interface LibraryCardProps {
    type: CardType;
    title: string;
    onPress: () => void;
    index: number;
}

const CARD_CONFIG = {
    articles: {
        colors: ['#FF6B6B', '#FF8E53', '#FFAE3D'] as const,
        icon: 'document-text-outline' as const,
        renderVector: () => (
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Path fill="#ffffff" opacity={0.1} d="M-20,150 Q60,80 120,100 T300,50 L300,160 L-20,160 Z" />
                <Path fill="#ffffff" opacity={0.15} d="M-20,160 Q80,120 160,110 T300,70 L300,160 L-20,160 Z" />
                <Path fill="#ffffff" opacity={0.05} d="M80,0 Q150,50 200,20 T300,40 L300,0 L80,0 Z" />
                <Circle cx="250" cy="-20" r="100" fill="#ffffff" opacity={0.1} />
            </Svg>
        ),
    },
    relaxation: {
        colors: ['#4A00E0', '#8E2DE2', '#C026D3'] as const,
        icon: 'moon-outline' as const,
        renderVector: () => (
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Path fill="none" stroke="#fff" strokeWidth="4" opacity={0.1} d="M-50,80 Q50,0 150,100 T350,20" />
                <Path fill="none" stroke="#fff" strokeWidth="2" opacity={0.15} d="M-50,100 Q60,30 140,120 T350,40" />
                <Path fill="none" stroke="#fff" strokeWidth="6" opacity={0.05} d="M-50,60 Q40,-20 160,80 T350,0" />
                <Circle cx="200" cy="120" r="40" fill="#fff" opacity={0.1} />
                <Circle cx="250" cy="90" r="20" fill="#fff" opacity={0.15} />
                <Circle cx="30" cy="30" r="60" fill="#fff" opacity={0.05} />
            </Svg>
        ),
    },
    breathe: {
        colors: ['#0093E9', '#00C9A7'] as const,
        icon: 'leaf-outline' as const,
        renderVector: () => (
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Circle cx="150" cy="150" r="140" fill="none" stroke="#fff" strokeWidth="2" opacity={0.05} />
                <Circle cx="150" cy="150" r="100" fill="none" stroke="#fff" strokeWidth="2" opacity={0.08} />
                <Circle cx="150" cy="150" r="60" fill="none" stroke="#fff" strokeWidth="3" opacity={0.12} />
                <Circle cx="150" cy="150" r="20" fill="#fff" opacity={0.15} />
                <Polygon points="0,150 200,-50 250,-50 0,200" fill="#fff" opacity={0.05} />
            </Svg>
        ),
    },
    journal: {
        colors: ['#1A2980', '#26D0CE'] as const,
        icon: 'journal-outline' as const,
        renderVector: () => (
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Polygon points="-20,150 80,40 160,150" fill="#fff" opacity={0.08} />
                <Polygon points="80,40 200,90 160,150" fill="#fff" opacity={0.12} />
                <Polygon points="200,90 300,20 320,150 160,150" fill="#fff" opacity={0.05} />
                <Polygon points="20,0 80,40 -20,150 -20,0" fill="#fff" opacity={0.03} />
                <Polygon points="80,40 200,0 300,20" fill="#fff" opacity={0.07} />
            </Svg>
        ),
    },
    motivation: {
        colors: ['#F59E0B', '#EF4444', '#F97316'] as const,
        icon: 'flame-outline' as const,
        renderVector: () => (
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Path fill="#ffffff" opacity={0.1} d="M-20,160 Q40,100 100,130 T250,80 L300,160 L-20,160 Z" />
                <Path fill="#ffffff" opacity={0.15} d="M-20,160 Q60,120 140,140 T300,100 L300,160 L-20,160 Z" />
                <Circle cx="240" cy="30" r="50" fill="#ffffff" opacity={0.08} />
                <Circle cx="260" cy="50" r="30" fill="#ffffff" opacity={0.12} />
                <Path fill="#ffffff" opacity={0.06} d="M150,0 Q180,60 220,40 T300,0 L150,0 Z" />
            </Svg>
        ),
    },
};

export function LibraryCard({ type, title, onPress, index }: LibraryCardProps) {
    const config = CARD_CONFIG[type];
    const gradientColors = config.colors as unknown as readonly [string, string, ...string[]];

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
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        flex: 1,
                        width: '100%',
                        minHeight: 160,
                        borderRadius: 28, // High-end rounded rectangle squircle
                        overflow: 'hidden',
                        padding: 20,
                        justifyContent: 'space-between',
                    }}
                >
                    <View style={{ ...StyleSheet.absoluteFillObject, borderRadius: 28, overflow: 'hidden' }}>
                        {config.renderVector()}
                    </View>

                    {/* Top Icon Area showing premium glassmorphic backing */}
                    <View style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Ionicons name={config.icon} size={24} color="#FFF" />
                    </View>

                    {/* Bottom Title Area */}
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 22,
                            fontWeight: '700',
                            letterSpacing: 0.5,
                            zIndex: 10,
                            textShadowColor: 'rgba(0,0,0,0.15)',
                            textShadowOffset: { width: 0, height: 2 },
                            textShadowRadius: 8,
                        }}
                    >
                        {title}
                    </Text>
                </LinearGradient>
            </Pressable>
        </Animated.View>
    );
}
