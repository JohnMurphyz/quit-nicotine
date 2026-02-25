import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PanResponder, Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Ionicons from '@expo/vector-icons/Ionicons';

interface SignaturePadProps {
    onSignatureChange: (hasSigned: boolean) => void;
    height?: number;
    strokeColor?: string;
    strokeWidth?: number;
}

type Point = { x: number; y: number };

function pointsToPath(points: Point[]): string {
    if (points.length < 2) return '';

    let d = `M ${points[0].x} ${points[0].y}`;

    if (points.length === 2) {
        d += ` L ${points[1].x} ${points[1].y}`;
        return d;
    }

    // Quadratic bezier midpoint interpolation for smooth curves
    for (let i = 1; i < points.length - 1; i++) {
        const midX = (points[i].x + points[i + 1].x) / 2;
        const midY = (points[i].y + points[i + 1].y) / 2;
        d += ` Q ${points[i].x} ${points[i].y} ${midX} ${midY}`;
    }

    // Connect to the last point
    const last = points[points.length - 1];
    d += ` L ${last.x} ${last.y}`;

    return d;
}

const MOVE_THRESHOLD = 3;

export default function SignaturePad({
    onSignatureChange,
    height = 150,
    strokeColor = '#ffffff',
    strokeWidth = 2.5,
}: SignaturePadProps) {
    const [completedPaths, setCompletedPaths] = useState<string[]>([]);
    const [currentPath, setCurrentPath] = useState<string>('');
    const currentPoints = useRef<Point[]>([]);
    const lastPoint = useRef<Point | null>(null);
    const hasHapticked = useRef(false);

    useEffect(() => {
        onSignatureChange(completedPaths.length > 0);
    }, [completedPaths.length, onSignatureChange]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onStartShouldSetPanResponderCapture: () => true,

            onPanResponderGrant: (_, gestureState) => {
                const x = gestureState.x0;
                const y = gestureState.y0;

                if (!hasHapticked.current) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    hasHapticked.current = true;
                }

                currentPoints.current = [{ x, y }];
                lastPoint.current = { x, y };
                setCurrentPath(`M ${x} ${y}`);
            },

            onPanResponderMove: (evt) => {
                const x = evt.nativeEvent.locationX;
                const y = evt.nativeEvent.locationY;

                if (lastPoint.current) {
                    const dx = x - lastPoint.current.x;
                    const dy = y - lastPoint.current.y;
                    if (dx * dx + dy * dy < MOVE_THRESHOLD * MOVE_THRESHOLD) return;
                }

                lastPoint.current = { x, y };
                currentPoints.current.push({ x, y });
                setCurrentPath(pointsToPath(currentPoints.current));
            },

            onPanResponderRelease: () => {
                if (currentPoints.current.length >= 2) {
                    const pathD = pointsToPath(currentPoints.current);
                    setCompletedPaths((prev) => [...prev, pathD]);
                }
                currentPoints.current = [];
                lastPoint.current = null;
                setCurrentPath('');
            },
        }),
    ).current;

    const handleClear = useCallback(() => {
        setCompletedPaths([]);
        setCurrentPath('');
        currentPoints.current = [];
        lastPoint.current = null;
        hasHapticked.current = false;
    }, []);

    const hasStrokes = completedPaths.length > 0 || currentPath !== '';

    return (
        <View style={{ height }} className="w-full relative">
            {/* Clear button */}
            {completedPaths.length > 0 && (
                <Pressable onPress={handleClear} className="absolute top-1 right-1 z-10 p-1.5">
                    <Ionicons name="refresh-outline" size={18} color="rgba(255,255,255,0.5)" />
                </Pressable>
            )}

            {/* Placeholder */}
            {!hasStrokes && (
                <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
                    <Text className="text-white/25 text-sm mb-2 italic">Sign here</Text>
                    <View className="w-3/4 h-px bg-white/15" />
                </View>
            )}

            {/* SVG Canvas */}
            <View {...panResponder.panHandlers} className="flex-1">
                <Svg width="100%" height="100%">
                    {completedPaths.map((d, i) => (
                        <Path
                            key={i}
                            d={d}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    ))}
                    {currentPath !== '' && (
                        <Path
                            d={currentPath}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}
                </Svg>
            </View>
        </View>
    );
}
