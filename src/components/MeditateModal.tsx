import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { BREATHING_PATTERNS, BreathingExercise, BreathingPattern } from '@/src/components/BreathingExercise';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MeditateModalProps {
  visible: boolean;
  onClose: () => void;
}

const PATTERN_KEYS = ['calm', 'sleep', 'awake'];
const TRACK_WIDTH = 210;
const TRACK_HEIGHT = 56;
const PILL_WIDTH = (TRACK_WIDTH - 8) / 3;

export function MeditateModal({ visible, onClose }: MeditateModalProps) {
  const colors = useThemeColors();
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(BREATHING_PATTERNS.calm);

  const selectedIndex = PATTERN_KEYS.indexOf(selectedPattern.id);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withSpring(4 + selectedIndex * PILL_WIDTH, { mass: 0.8, damping: 15, stiffness: 150 }) }
      ]
    };
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <AnimatedSkyBackground>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          {/* Header with Chevron Back */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 20, paddingTop: 16 }}>
            <Pressable
              onPress={onClose}
              style={{
                backgroundColor: colors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                width: 40, height: 40, borderRadius: 20,
                alignItems: 'center', justifyContent: 'center'
              }}
            >
              <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
            </Pressable>
          </View>

          {/* Breathing exercise */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <BreathingExercise pattern={selectedPattern} />
          </View>

          {/* Bottom Controls Segment */}
          <View style={{ paddingBottom: 32, alignItems: 'center' }}>
            {/* Title */}
            <View style={{ alignItems: 'center', paddingBottom: 24, height: 70, justifyContent: 'center' }}>
              <Animated.Text
                key={selectedPattern.id + "-name"}
                entering={FadeIn.duration(400)}
                exiting={FadeOut.duration(400)}
                style={{ fontSize: 22, fontWeight: '700', color: colors.textPrimary, marginBottom: 4, position: 'absolute', top: 0 }}
              >
                {selectedPattern.name}
              </Animated.Text>
              <Animated.Text
                key={selectedPattern.id + "-desc"}
                entering={FadeIn.delay(100).duration(400)}
                exiting={FadeOut.duration(400)}
                style={{ fontSize: 13, color: colors.textSecondary, fontWeight: '500', letterSpacing: 0.5, position: 'absolute', top: 32 }}
              >
                {selectedPattern.description}
              </Animated.Text>
            </View>

            {/* Minimalist 3-Position Slider */}
            <View
              style={{
                width: TRACK_WIDTH,
                height: TRACK_HEIGHT,
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderRadius: TRACK_HEIGHT / 2,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.1)',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              {/* Sliding Pill Indicator */}
              <Animated.View
                style={[{
                  position: 'absolute',
                  left: 0,
                  width: PILL_WIDTH,
                  height: TRACK_HEIGHT - 8,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: (TRACK_HEIGHT - 8) / 2,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                }, indicatorStyle]}
              />

              {/* Interaction Regions */}
              {PATTERN_KEYS.map((key) => {
                const pattern = BREATHING_PATTERNS[key];
                const isActive = selectedPattern.id === key;

                let iconName: any = 'leaf';
                if (key === 'sleep') iconName = 'moon';
                if (key === 'awake') iconName = 'sunny';

                return (
                  <Pressable
                    key={key}
                    onPress={() => setSelectedPattern(pattern)}
                    style={{ flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Ionicons
                      name={isActive ? iconName : `${iconName}-outline`}
                      size={22}
                      color={isActive ? '#ffffff' : 'rgba(255,255,255,0.5)'}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>
        </SafeAreaView>
      </AnimatedSkyBackground>
    </Modal>
  );
}
