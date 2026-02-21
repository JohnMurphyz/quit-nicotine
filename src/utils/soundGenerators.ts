import { AudioContext, type AudioBuffer, type GainNode } from 'react-native-audio-api';

type CleanupFn = () => void;
type GeneratorFn = (ctx: AudioContext, masterGain: GainNode) => CleanupFn;

const BUFFER_DURATION = 4; // seconds of noise buffer to loop

// --- Noise buffer helpers ---

function createWhiteNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const length = ctx.sampleRate * BUFFER_DURATION;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function createBrownNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const length = ctx.sampleRate * BUFFER_DURATION;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5; // boost amplitude
  }
  return buffer;
}

function createPinkNoiseBuffer(ctx: AudioContext): AudioBuffer {
  // Kellet's refined method — 7 white noise sources
  const length = ctx.sampleRate * BUFFER_DURATION;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
  }
  return buffer;
}

// --- Generators ---

export const createOceanWaves: GeneratorFn = (ctx, masterGain) => {
  const buffer = createBrownNoiseBuffer(ctx);

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 400;

  // Primary LFO for sweeping tide
  const primaryLfo = ctx.createOscillator();
  primaryLfo.type = 'sine';
  primaryLfo.frequency.value = 0.06; // Slow wave 

  const primaryGain = ctx.createGain();
  primaryGain.gain.value = 0.4;

  // Secondary LFO for random crashing intensity
  const secondaryLfo = ctx.createOscillator();
  secondaryLfo.type = 'triangle';
  secondaryLfo.frequency.value = 0.015;

  const secondaryGain = ctx.createGain();
  secondaryGain.gain.value = 0.2;

  const modGain = ctx.createGain();
  modGain.gain.value = 0.5; // Base volume before modulation

  // Modulate the modulator for organic unpredictability
  primaryLfo.connect(primaryGain);
  secondaryLfo.connect(secondaryGain);

  primaryGain.connect(modGain.gain);
  secondaryGain.connect(modGain.gain);

  source.connect(lowpass);
  lowpass.connect(modGain);
  modGain.connect(masterGain);

  source.start(0);
  primaryLfo.start(0);
  secondaryLfo.start(0);

  return () => {
    try { source.stop(0); } catch { }
    try { primaryLfo.stop(0); } catch { }
    try { secondaryLfo.stop(0); } catch { }
    source.disconnect();
    lowpass.disconnect();
    modGain.disconnect();
    primaryLfo.disconnect();
    primaryGain.disconnect();
    secondaryLfo.disconnect();
    secondaryGain.disconnect();
  };
};

export const createGentleRain: GeneratorFn = (ctx, masterGain) => {
  const buffer = createPinkNoiseBuffer(ctx);

  const washSource = ctx.createBufferSource();
  washSource.buffer = buffer;
  washSource.loop = true;

  // Background wash (distance)
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 800;

  const washGain = ctx.createGain();
  washGain.gain.value = 0.6;

  // Foreground droplets (closer, sharper)
  const dropSource = ctx.createBufferSource();
  dropSource.buffer = createWhiteNoiseBuffer(ctx);
  dropSource.loop = true;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 4500;
  bandpass.Q.value = 1.2;

  const highshelf = ctx.createBiquadFilter();
  highshelf.type = 'highshelf';
  highshelf.frequency.value = 7000;
  highshelf.gain.value = -8;

  const dropGain = ctx.createGain();
  dropGain.gain.value = 0.4;

  // Organic volume swell for wind gusts
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.1;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.15;

  const modGain = ctx.createGain();
  modGain.gain.value = 0.8;

  lfo.connect(lfoGain);
  lfoGain.connect(modGain.gain);

  washSource.connect(lowpass);
  lowpass.connect(washGain);
  washGain.connect(modGain);

  dropSource.connect(bandpass);
  bandpass.connect(highshelf);
  highshelf.connect(dropGain);
  dropGain.connect(modGain);

  modGain.connect(masterGain);

  washSource.start(0);
  dropSource.start(0);
  lfo.start(0);

  return () => {
    try { washSource.stop(0); } catch { }
    try { dropSource.stop(0); } catch { }
    try { lfo.stop(0); } catch { }
    washSource.disconnect();
    dropSource.disconnect();
    lowpass.disconnect();
    bandpass.disconnect();
    highshelf.disconnect();
    modGain.disconnect();
    lfo.disconnect();
  };
};

export const createSoftWind: GeneratorFn = (ctx, masterGain) => {
  const buffer = createPinkNoiseBuffer(ctx);

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 600;

  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.03;

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.25;

  const modGain = ctx.createGain();
  modGain.gain.value = 0.65;

  lfo.connect(lfoGain);
  lfoGain.connect(modGain.gain);

  source.connect(filter);
  filter.connect(modGain);
  modGain.connect(masterGain);

  source.start(0);
  lfo.start(0);

  return () => {
    try { source.stop(0); } catch { }
    try { lfo.stop(0); } catch { }
    source.disconnect();
    filter.disconnect();
    modGain.disconnect();
    lfo.disconnect();
    lfoGain.disconnect();
  };
};

export const createSingingBowl: GeneratorFn = (ctx, masterGain) => {
  const fundamental = 196; // Hz (G3)
  const harmonics = [1.0, 2.756, 5.404, 8.932, 13.34, 18.64];
  const decays = [5.0, 3.5, 2.5, 1.8, 1.2, 0.8]; // seconds
  const amplitudes = [1.0, 0.65, 0.35, 0.2, 0.1, 0.05];
  const retriggerInterval = 12; // seconds

  let stopped = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const activeNodes: { osc: ReturnType<typeof ctx.createOscillator>; gain: ReturnType<typeof ctx.createGain>; lfo?: ReturnType<typeof ctx.createOscillator> }[] = [];

  const strike = () => {
    if (stopped) return;
    const now = ctx.currentTime;

    harmonics.forEach((ratio, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = fundamental * ratio;

      // Add a slow vibrato LFO to the lower harmonics to simulate Bowl wobble
      let lfo: ReturnType<typeof ctx.createOscillator> | undefined;
      if (i < 3) {
        lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 4 + (i * 1.5); // 4Hz, 5.5Hz, 7Hz wobble

        const vibratoGain = ctx.createGain();
        vibratoGain.gain.value = 2; // +/- 2 cents of pitch modulation

        lfo.connect(vibratoGain);
        vibratoGain.connect(osc.detune);
        lfo.start(now);
      }

      const gain = ctx.createGain();
      // Fast attack
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(amplitudes[i], now + 0.05);
      // Long exponential decay
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05 + decays[i]);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + decays[i] + 0.2);

      activeNodes.push({ osc, gain, lfo });
    });

    timeoutId = setTimeout(strike, retriggerInterval * 1000);
  };

  strike();

  return () => {
    stopped = true;
    if (timeoutId) clearTimeout(timeoutId);
    activeNodes.forEach(({ osc, gain, lfo }) => {
      try { osc.stop(0); } catch { }
      try { if (lfo) lfo.stop(0); } catch { }
      osc.disconnect();
      gain.disconnect();
      if (lfo) lfo.disconnect();
    });
    activeNodes.length = 0;
  };
};

export const createDeepDrone: GeneratorFn = (ctx, masterGain) => {
  // Thick, lush chord (Root, Fifth, Octave, Sub-Octave)
  const freqs = [55, 110, 164.81, 220, 329.63]; // A1, A2, E3, A3, E4
  const detunes = [-6, -3, 0, 3, 6];
  const pans = [-0.8, -0.4, 0, 0.4, 0.8]; // Wide stereo spread

  const oscs = freqs.map((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = i === 0 ? 'triangle' : 'sine'; // Grittier sub
    osc.frequency.value = freq;
    osc.detune.value = detunes[i];

    const panner = ctx.createStereoPanner();
    panner.pan.value = pans[i];

    const gain = ctx.createGain();
    gain.gain.value = 1 / freqs.length; // Normalize

    osc.connect(gain);
    gain.connect(panner);
    return { osc, panner, gain };
  });

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 350; // Darken the overall mix

  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.04;

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.2;

  const modGain = ctx.createGain();
  modGain.gain.value = 0.8;

  lfo.connect(lfoGain);
  lfoGain.connect(modGain.gain);

  oscs.forEach(({ panner }) => panner.connect(filter));
  filter.connect(modGain);
  modGain.connect(masterGain);

  oscs.forEach(({ osc }) => osc.start(0));
  lfo.start(0);

  return () => {
    oscs.forEach(({ osc, panner, gain }) => {
      try { osc.stop(0); } catch { }
      osc.disconnect();
      panner.disconnect();
      gain.disconnect();
    });
    try { lfo.stop(0); } catch { }
    filter.disconnect();
    modGain.disconnect();
    lfo.disconnect();
    lfoGain.disconnect();
  };
};

export const createBinauralFocus: GeneratorFn = (ctx, masterGain) => {
  // Left ear: 200 Hz, Right ear: 210 Hz → 10 Hz binaural beat
  const oscL = ctx.createOscillator();
  oscL.type = 'sine';
  oscL.frequency.value = 200;

  const panL = ctx.createStereoPanner();
  panL.pan.value = -1;

  const oscR = ctx.createOscillator();
  oscR.type = 'sine';
  oscR.frequency.value = 210;

  const panR = ctx.createStereoPanner();
  panR.pan.value = 1;

  const gainL = ctx.createGain();
  gainL.gain.value = 0.5;

  const gainR = ctx.createGain();
  gainR.gain.value = 0.5;

  oscL.connect(gainL);
  gainL.connect(panL);
  panL.connect(masterGain);

  oscR.connect(gainR);
  gainR.connect(panR);
  panR.connect(masterGain);

  oscL.start(0);
  oscR.start(0);

  return () => {
    try { oscL.stop(0); } catch { }
    try { oscR.stop(0); } catch { }
    oscL.disconnect();
    oscR.disconnect();
    panL.disconnect();
    panR.disconnect();
    gainL.disconnect();
    gainR.disconnect();
  };
};

export type SoundId = 'ocean' | 'rain' | 'wind' | 'bowl' | 'drone' | 'binaural';

export const SOUND_GENERATORS: Record<SoundId, GeneratorFn> = {
  ocean: createOceanWaves,
  rain: createGentleRain,
  wind: createSoftWind,
  bowl: createSingingBowl,
  drone: createDeepDrone,
  binaural: createBinauralFocus,
};

export interface SoundInfo {
  id: SoundId;
  name: string;
  description: string;
  icon: string;
  badge?: string;
}

export const SOUNDS: SoundInfo[] = [
  { id: 'ocean', name: 'Ocean Waves', description: 'Rhythmic shoreline ambiance', icon: 'water-outline' },
  { id: 'rain', name: 'Gentle Rain', description: 'Soft rainfall on leaves', icon: 'rainy-outline' },
  { id: 'wind', name: 'Soft Wind', description: 'Breeze through the trees', icon: 'leaf-outline' },
  { id: 'bowl', name: 'Singing Bowl', description: 'Resonant harmonic tones', icon: 'musical-notes-outline' },
  { id: 'drone', name: 'Deep Drone', description: 'Low meditative hum', icon: 'radio-outline' },
  { id: 'binaural', name: 'Binaural Focus', description: '10 Hz alpha-wave beat', icon: 'headset-outline', badge: 'Headphones' },
];
