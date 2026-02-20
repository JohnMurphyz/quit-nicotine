import { useThemeColors } from '@/src/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { FlameIcon } from './FlameIcon';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

interface AchievementOverlayProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    description: string;
    iconName?: React.ComponentProps<typeof Ionicons>['name'];
}

export function AchievementOverlay({
    visible,
    onClose,
    title,
    description,
    iconName = 'trophy',
}: AchievementOverlayProps) {
    const colors = useThemeColors();
    const progress = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            progress.value = withSpring(1, { damping: 15, stiffness: 90 });
        } else {
            progress.value = withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) });
        }
    }, [visible, progress]);

    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            opacity: progress.value,
            transform: [
                { scale: interpolate(progress.value, [0, 1], [0.8, 1]) },
                { translateY: interpolate(progress.value, [0, 1], [40, 0]) },
            ],
        };
    });

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: interpolate(progress.value, [0, 1], [0.5, 1]) },
                { rotate: `${interpolate(progress.value, [0, 1], [-15, 0])}deg` },
            ],
        };
    });

    if (!visible && progress.value === 0) return null;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <BlurView
                intensity={80}
                tint={colors.isDark ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
            >
                <View style={styles.container}>
                    <Animated.View style={[styles.content, animatedContainerStyle, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
                        <Animated.View style={[styles.iconContainer, animatedIconStyle, {
                            backgroundColor: iconName === 'flame'
                                ? (colors.isDark ? 'rgba(249,115,22,0.15)' : '#ffedd5')
                                : (colors.isDark ? 'rgba(250, 204, 21, 0.15)' : '#fef08a')
                        }]}>
                            {iconName === 'flame'
                                ? <FlameIcon size={52} active />
                                : <Ionicons name={iconName} size={48} color={colors.isDark ? '#fde047' : '#ca8a04'} />
                            }
                        </Animated.View>

                        <Text style={[styles.title, { color: colors.textPrimary }]}>
                            {title}
                        </Text>

                        <Text style={[styles.description, { color: colors.textSecondary }]}>
                            {description}
                        </Text>

                        <Pressable
                            onPress={onClose}
                            style={({ pressed }) => [
                                styles.button,
                                { backgroundColor: colors.isDark ? '#eab308' : '#ca8a04', opacity: pressed ? 0.8 : 1 }
                            ]}
                        >
                            <Text style={styles.buttonText}>Continue Journey</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </BlurView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: 'rgba(0,0,0,0.5)', // Fallback if blur fails or dims the background further
    },
    content: {
        width: '100%',
        padding: 32,
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    button: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
    },
});
