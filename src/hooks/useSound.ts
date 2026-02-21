import { useCallback, useEffect, useRef, useState } from 'react';
import { AudioContext, type GainNode } from 'react-native-audio-api';
import { SOUND_GENERATORS, type SoundId } from '@/src/utils/soundGenerators';

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<SoundId | null>(null);
  const [volume, setVolumeState] = useState(0.7);

  const ensureContext = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      const ctx = new AudioContext();
      const gain = ctx.createGain();
      gain.gain.value = volume;
      gain.connect(ctx.destination);
      ctxRef.current = ctx;
      masterGainRef.current = gain;
    }
    return { ctx: ctxRef.current, masterGain: masterGainRef.current! };
  }, [volume]);

  const stopCurrent = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
  }, []);

  const play = useCallback((id: SoundId) => {
    stopCurrent();
    const { ctx, masterGain } = ensureContext();
    const generator = SOUND_GENERATORS[id];
    cleanupRef.current = generator(ctx, masterGain);
    setCurrentSound(id);
    setIsPlaying(true);
  }, [ensureContext, stopCurrent]);

  const pause = useCallback(() => {
    stopCurrent();
    setIsPlaying(false);
    setCurrentSound(null);
  }, [stopCurrent]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = clamped;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCurrent();
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        ctxRef.current.close();
      }
    };
  }, [stopCurrent]);

  return { isPlaying, currentSound, volume, play, pause, setVolume };
}
