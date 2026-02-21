import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeInRight } from 'react-native-reanimated';
import Svg, { Circle, Path, Polygon } from 'react-native-svg';

export interface ArticleCardProps {
    title: string;
    categoryName: string;
    index: number;
    isCompleted: boolean;
    onPress: () => void;
}

const CATEGORY_STYLES: Record<string, { colors: readonly [string, string, ...string[]]; renderVector: () => React.JSX.Element }> = {
    'Understanding Addiction': {
        colors: ['#FF6B6B', '#FF8E53', '#FFAE3D'] as const,
        renderVector: () => (
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Path fill="#ffffff" opacity={0.1} d="M-20,100 Q60,40 120,60 T300,20 L300,120 L-20,120 Z" />
                <Path fill="#ffffff" opacity={0.15} d="M-20,120 Q80,80 160,70 T300,30 L300,120 L-20,120 Z" />
            </Svg>
        ),
    },
    'Managing Cravings': {
        colors: ['#FF0076', '#FF00A2', '#C026D3'] as const,
        renderVector: () => (
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Polygon points="-20,120 80,20 160,120" fill="#fff" opacity={0.08} />
                <Polygon points="80,20 200,60 160,120" fill="#fff" opacity={0.12} />
                <Polygon points="200,60 300,0 320,120 160,120" fill="#fff" opacity={0.05} />
            </Svg>
        ),
    },
    'Health & Recovery': {
        colors: ['#4A00E0', '#8E2DE2', '#B06AB3'] as const,
        renderVector: () => (
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Circle cx="120" cy="120" r="100" fill="none" stroke="#fff" strokeWidth="2" opacity={0.05} />
                <Circle cx="120" cy="120" r="70" fill="none" stroke="#fff" strokeWidth="2" opacity={0.08} />
                <Circle cx="120" cy="120" r="40" fill="none" stroke="#fff" strokeWidth="3" opacity={0.12} />
            </Svg>
        ),
    },
    'Support & Mindset': {
        colors: ['#0072ff', '#00c6ff'] as const,
        renderVector: () => (
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Path fill="none" stroke="#fff" strokeWidth="4" opacity={0.1} d="M-20,60 Q50,0 150,80 T350,20" />
                <Path fill="none" stroke="#fff" strokeWidth="2" opacity={0.15} d="M-20,80 Q60,20 140,100 T350,40" />
                <Circle cx="150" cy="80" r="30" fill="#fff" opacity={0.1} />
                <Circle cx="50" cy="30" r="15" fill="#fff" opacity={0.15} />
            </Svg>
        ),
    },
};

// Fallback config if category name doesn't match perfectly
const FALLBACK_CONFIG = {
    colors: ['#4b5563', '#374151', '#1f2937'] as const,
    renderVector: () => <Svg height="100%" width="100%" style={StyleSheet.absoluteFill} />
};

export function ArticleCard({ title, categoryName, index, isCompleted, onPress }: ArticleCardProps) {
    const config = CATEGORY_STYLES[categoryName] || FALLBACK_CONFIG;

    return (
        <Animated.View entering={FadeInRight.delay(index * 100).duration(400).easing(Easing.out(Easing.cubic))} style={{ width: 150, height: 120 }}>
            <Pressable
                onPress={onPress}
                style={({ pressed }) => ({
                    flex: 1,
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                })}
            >
                <LinearGradient
                    colors={config.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        flex: 1,
                        width: '100%',
                        minHeight: 120,
                        borderRadius: 24, // High-end rounded rectangle squircle
                        overflow: 'hidden',
                        padding: 12,
                        justifyContent: 'space-between',
                    }}
                >
                    <View style={{ ...StyleSheet.absoluteFillObject, borderRadius: 24, overflow: 'hidden' }}>
                        {config.renderVector()}
                    </View>

                    <View
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: 'rgba(255,255,255,0.25)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {isCompleted ? (
                            <Ionicons name="checkmark" size={18} color="white" />
                        ) : (
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
                                {index + 1}
                            </Text>
                        )}
                    </View>

                    <Text
                        numberOfLines={2}
                        style={{
                            color: 'white',
                            fontSize: 14,
                            fontWeight: '600',
                            letterSpacing: 0.2,
                            zIndex: 10,
                            textShadowColor: 'rgba(0,0,0,0.15)',
                            textShadowOffset: { width: 0, height: 1 },
                            textShadowRadius: 4,
                        }}
                    >
                        {title}
                    </Text>
                </LinearGradient>
            </Pressable>
        </Animated.View>
    );
}
