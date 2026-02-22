import { AnimatedSkyBackground } from '@/src/components/AnimatedSkyBackground';
import { BreathingOrb } from '@/src/components/BreathingOrb';
import { ScreenTitle } from '@/src/components/ScreenTitle';
import { useSound } from '@/src/hooks/useSound';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { SOUNDS, type SoundId } from '@/src/utils/soundGenerators';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LinearGradient } from 'expo-linear-gradient';

export default function RelaxationScreen() {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const { isPlaying, currentSound, volume, play, pause, setVolume } = useSound();

  // Sleep timer
  const [isTimerModalVisible, setTimerModalVisible] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleSoundPress = useCallback((id: SoundId) => {
    if (currentSound === id && isPlaying) {
      pause();
    } else {
      play(id);
    }
  }, [currentSound, isPlaying, pause, play]);

  // Sleep timer logic
  const startTimer = useCallback((minutes: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerMinutes(minutes);
    setTimerSecondsLeft(minutes * 60);
    timerRef.current = setInterval(() => {
      setTimerSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          setTimerMinutes(null);
          pause();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [pause]);

  const cancelTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setTimerMinutes(null);
    setTimerSecondsLeft(0);
  }, []);

  const openTimerModal = useCallback(() => {
    setTimerModalVisible(true);
  }, []);

  const selectTimer = useCallback((minutes: number | null) => {
    if (minutes === null) {
      cancelTimer();
    } else {
      startTimer(minutes);
    }
    setTimerModalVisible(false);
  }, [cancelTimer, startTimer]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatedSkyBackground>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-5 pt-4 pb-2">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: colors.elevatedBg }}
          >
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <ScreenTitle>Relax</ScreenTitle>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 160 }}
        >
          <View className="items-center justify-center py-8" style={{ minHeight: 240, marginTop: 20 }}>
            {isPlaying ? (
              <BreathingOrb size={180} breathDuration={5000} />
            ) : (
              <View
                className="w-48 h-48 rounded-[48px] items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <Ionicons name="headset-outline" size={64} color="rgba(255,255,255,0.6)" />
                <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 12, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '600' }}>
                  Select Sound
                </Text>
              </View>
            )}
          </View>

          {/* Now playing label */}
          {currentSound && (
            <Text
              className="text-center mb-4"
              style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary }}
            >
              {SOUNDS.find((s) => s.id === currentSound)?.name}
            </Text>
          )}

          {/* Sound Grid */}
          <View className="px-5">
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 }}>
              Sounds
            </Text>
            <View className="flex-row flex-wrap justify-between" style={{ gap: 14 }}>
              {SOUNDS.map((sound) => {
                const isActive = currentSound === sound.id && isPlaying;

                // Active gradients based on sound type
                const getGradient = (id: string) => {
                  if (id === 'ocean') return ['#0072ff', '#00c6ff'] as const;
                  if (id === 'rain') return ['#4A00E0', '#8E2DE2'] as const;
                  if (id === 'wind') return ['#0093E9', '#80D0C7'] as const;
                  if (id === 'bowl') return ['#FF6B6B', '#FFAE3D'] as const;
                  if (id === 'drone') return ['#FF0076', '#590FB7'] as const;
                  return ['#1A2980', '#26D0CE'] as const; // binaural
                };

                return (
                  <Pressable
                    key={sound.id}
                    onPress={() => handleSoundPress(sound.id)}
                    style={{ width: '47.5%', flexGrow: 0 }}
                  >
                    <View
                      style={[{
                        borderRadius: 24, // 2026 Squircle Apple Aesthetic
                        overflow: 'hidden',
                        height: 140, // Taller, premium layout
                        borderWidth: isActive ? 0 : 1,
                        borderColor: 'rgba(255,255,255,0.08)',
                        backgroundColor: isActive ? 'transparent' : 'rgba(255,255,255,0.03)',
                      }]}
                    >
                      {isActive && (
                        <LinearGradient
                          colors={getGradient(sound.id)}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={StyleSheet.absoluteFill}
                        />
                      )}

                      <View style={{ flex: 1, padding: 18, justifyContent: 'space-between' }}>
                        <View className="flex-row items-center justify-between">
                          <View style={{
                            width: 40, height: 40, borderRadius: 20,
                            backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                            justifyContent: 'center', alignItems: 'center'
                          }}>
                            <Ionicons
                              name={sound.icon as any}
                              size={22}
                              color={isActive ? '#FFFFFF' : colors.textPrimary}
                            />
                          </View>
                          {isActive && (
                            <View className="w-10 h-10 items-center justify-center">
                              <View className="w-2 h-2 rounded-full bg-white shadow-sm" />
                            </View>
                          )}
                        </View>

                        <View>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: '700',
                              color: isActive ? '#FFFFFF' : colors.textPrimary,
                              marginBottom: 4,
                              textShadowColor: isActive ? 'rgba(0,0,0,0.1)' : 'transparent',
                              textShadowOffset: { width: 0, height: 1 },
                              textShadowRadius: 2,
                            }}
                          >
                            {sound.name}
                          </Text>
                          <Text style={{ fontSize: 13, color: isActive ? 'rgba(255,255,255,0.8)' : colors.textMuted, lineHeight: 18 }}>
                            {sound.description}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Player Bar */}
        <View
          className="absolute bottom-0 left-0 right-0 px-5 pb-2"
          style={{ backgroundColor: 'transparent' }}
        >
          <SafeAreaView edges={['bottom']}>
            <View
              className="flex-row items-center justify-between rounded-2xl px-4 py-3"
              style={{ backgroundColor: colors.isDark ? 'rgba(14,11,40,0.92)' : 'rgba(245,239,232,0.95)' }}
            >
              <View className="flex-1" />

              {/* Play/Pause */}
              <Pressable
                onPress={() => {
                  if (isPlaying) {
                    pause();
                  } else if (currentSound) {
                    play(currentSound);
                  }
                }}
                className="w-16 h-16 rounded-full items-center justify-center shadow-lg"
                style={{ backgroundColor: colors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
              >
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={28}
                  color={colors.textPrimary}
                  style={!isPlaying ? { marginLeft: 3 } : undefined}
                />
              </Pressable>

              <View className="flex-1 items-end justify-center pr-2">
                {/* Sleep timer */}
                <Pressable onPress={openTimerModal} className="p-3 bg-white/5 rounded-full">
                  <Ionicons
                    name="timer-outline"
                    size={24}
                    color={timerMinutes ? colors.textPrimary : colors.textMuted}
                  />
                  {timerMinutes && (
                    <View className="absolute -top-1 -right-1 bg-white px-1.5 rounded-md shadow-sm">
                      <Text style={{ fontSize: 9, color: '#000', fontWeight: '800' }}>
                        {formatTimer(timerSecondsLeft)}
                      </Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </View>

        {/* Timer Selection Modal */}
        <Modal
          visible={isTimerModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setTimerModalVisible(false)}
        >
          <View className="flex-1 justify-end px-4 pb-12" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setTimerModalVisible(false)} />
            <View className="rounded-[32px] overflow-hidden shadow-2xl pb-6" style={{ backgroundColor: colors.isDark ? '#1C1C1E' : '#FFFFFF' }}>
              <View className="items-center py-4 border-b border-white/10">
                <View className="w-12 h-1.5 rounded-full bg-white/20 mb-4" />
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>Sleep Timer</Text>
              </View>

              <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
                <View className="flex-row flex-wrap justify-center gap-3">
                  {[10, 15, 20, 30, 45, 60].map(mins => (
                    <Pressable
                      key={mins}
                      onPress={() => selectTimer(mins)}
                      className="w-[30%] py-4 rounded-2xl items-center justify-center border"
                      style={{
                        borderColor: timerMinutes === mins ? colors.textPrimary : 'rgba(255,255,255,0.08)',
                        backgroundColor: timerMinutes === mins ? (colors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)') : 'transparent'
                      }}
                    >
                      <Text style={{ fontSize: 22, fontWeight: '600', color: colors.textPrimary }}>{mins}</Text>
                      <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>min</Text>
                    </Pressable>
                  ))}
                </View>

                <Pressable
                  onPress={() => selectTimer(null)}
                  className="mt-6 py-4 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.isDark ? 'rgba(255,69,58,0.15)' : 'rgba(255,59,48,0.1)' }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '700', color: colors.isDark ? '#FF6961' : '#FF3B30' }}>
                    Turn Timer Off
                  </Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </AnimatedSkyBackground>
  );
}
