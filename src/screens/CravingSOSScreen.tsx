import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@/src/stores/authStore';
import { useCravingStore } from '@/src/stores/cravingStore';
import { BreathingExercise } from '@/src/components/BreathingExercise';
import { Button } from '@/src/components/ui/Button';

const TIPS = [
  { icon: 'water', text: 'Drink a glass of water' },
  { icon: 'walk', text: 'Go for a short walk' },
  { icon: 'call', text: 'Call someone you trust' },
  { icon: 'nutrition', text: 'Chew gum or have a healthy snack' },
  { icon: 'hand-left', text: 'Squeeze something — stress ball, pillow' },
  { icon: 'musical-notes', text: 'Put on your favorite song' },
];

export default function CravingSOSScreen() {
  const navigation = useNavigation();
  const { user, profile } = useAuthStore();
  const { cravings, logCraving, markResisted } = useCravingStore();
  const [seconds, setSeconds] = useState(0);
  const [sosCravingId, setSosCravingId] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    // Log an SOS craving on open
    const log = async () => {
      if (!user?.id) return;
      await logCraving(user.id, { intensity: 8 });
    };
    log();

    // Start timer
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Capture the craving ID after logging
  useEffect(() => {
    if (!sosCravingId && cravings.length > 0) {
      setSosCravingId(cravings[0].id);
    }
  }, [cravings, sosCravingId]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMadeIt = async () => {
    if (sosCravingId) {
      await markResisted(sosCravingId);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-warm-50">
      <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
        <Text className="text-2xl font-bold text-warm-800">SOS Mode</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#8c7a66" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-6" contentContainerClassName="pb-12">
        {/* Breathing Exercise */}
        <View className="items-center py-8">
          <BreathingExercise />
        </View>

        {/* Timer */}
        <View className="bg-warm-200 rounded-2xl p-6 items-center mb-6">
          <Text className="text-4xl font-bold text-warm-800 mb-2">
            {formatTime(seconds)}
          </Text>
          <Text className="text-base text-warm-500 text-center">
            This craving will pass. Average craving lasts 3-5 minutes.
          </Text>
        </View>

        {/* Quick Tips */}
        <Text className="text-lg font-bold text-warm-800 mb-3">Try This</Text>
        <View className="gap-2 mb-6">
          {TIPS.map((tip) => (
            <View
              key={tip.text}
              className="flex-row items-center bg-warm-100 rounded-xl p-3 border border-warm-200"
            >
              <Ionicons name={tip.icon as any} size={22} color="#8c7a66" />
              <Text className="text-base text-warm-600 ml-3">{tip.text}</Text>
            </View>
          ))}
        </View>

        {/* Motivations */}
        {profile?.motivations && profile.motivations.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-warm-800 mb-3">
              Remember Why
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {profile.motivations.map((m) => (
                <View key={m} className="bg-warm-200 px-4 py-2 rounded-full">
                  <Text className="text-warm-700 font-medium">{m}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Made it button */}
        <View className="mt-4">
          <Button
            title="I made it through!"
            size="lg"
            onPress={handleMadeIt}
          />
          <Text className="text-sm text-warm-400 text-center mt-2">
            This will be logged as a resisted craving
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
