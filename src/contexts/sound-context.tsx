import { Howl, Howler } from 'howler';
import { createContext, useContext, useEffect, useRef } from 'react';
import { playSound } from '@/lib/pad';

type SoundContextType = {
  playPad: (pad: Pad) => void;
  updatePadLoop: (pad: Pad) => void;
  updatePadVolume: (pad: Pad) => void;
  updatePadReverb: (pad: Pad) => void;
};

const SoundContext = createContext<SoundContextType | null>(null);

const soundMap = new Map<string, Howl>();
const convolverMap = new Map<string, ConvolverNode>();
const gainDryMap = new Map<string, GainNode>();
const gainWetMap = new Map<string, GainNode>();

function createImpulseResponse(context: AudioContext, seconds = 2, decay = 2) {
  const rate = context.sampleRate;
  const length = rate * seconds;
  const impulse = context.createBuffer(2, length, rate);
  for (let i = 0; i < 2; i++) {
    const channel = impulse.getChannelData(i);
    for (let j = 0; j < length; j++) {
      channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, decay);
    }
  }
  return impulse;
}

type HowlWithSounds = Howl & { _sounds: Array<{ _node: AudioNode }> };

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const soundRefs = useRef<Map<string, Howl>>(new Map());

  useEffect(() => {
    const currentSoundRefs = soundRefs.current;
    return () => {
      currentSoundRefs.forEach((sound) => {
        if (sound.playing()) {
          sound.stop();
        }
      });
    };
  }, []);

  const setupReverb = (pad: Pad, sound: Howl) => {
    if (!Howler.usingWebAudio || !pad.url) return;
    const ctx = Howler.ctx as AudioContext;
    const howlSound = (sound as HowlWithSounds)._sounds?.[0];
    if (!howlSound || !howlSound._node) return;

    if (convolverMap.has(pad.url)) return;

    const sourceNode = howlSound._node;
    const convolver = ctx.createConvolver();
    convolver.buffer = createImpulseResponse(ctx, 2, 2);

    const gainDry = ctx.createGain();
    const gainWet = ctx.createGain();

    sourceNode.disconnect();
    sourceNode.connect(gainDry);
    sourceNode.connect(convolver);

    convolver.connect(gainWet);

    gainDry.connect(ctx.destination);
    gainWet.connect(ctx.destination);

    const wet = pad.reverb ?? 0;
    gainWet.gain.value = wet;
    gainDry.gain.value = 1 - wet;

    convolverMap.set(pad.url, convolver);
    gainDryMap.set(pad.url, gainDry);
    gainWetMap.set(pad.url, gainWet);
  };

  const playPad = (pad: Pad) => {
    if (!pad.url) return;

    let sound = soundRefs.current.get(pad.url);

    if (!sound) {
      if (soundMap.has(pad.url)) {
        sound = soundMap.get(pad.url)!;
      } else {
        sound = new Howl({
          src: pad.url,
          volume: pad.volume,
          loop: pad.isLooped
        });
        soundMap.set(pad.url, sound);
      }
      soundRefs.current.set(pad.url, sound);
    }

    setupReverb(pad, sound);

    playSound(sound);
  };

  const updatePadLoop = (pad: Pad) => {
    if (!pad.url) return;

    const sound = soundRefs.current.get(pad.url);
    if (sound) {
      sound.loop(pad.isLooped);
    }
  };

  const updatePadVolume = (pad: Pad) => {
    if (!pad.url) return;

    const sound = soundRefs.current.get(pad.url);
    if (sound) {
      sound.volume(pad.volume);
    }
  };

  const updatePadReverb = (pad: Pad) => {
    if (!pad.url) return;
    const wet = pad.reverb ?? 0;
    const gainDry = gainDryMap.get(pad.url);
    const gainWet = gainWetMap.get(pad.url);
    if (gainDry && gainWet) {
      gainWet.gain.value = wet;
      gainDry.gain.value = 1 - wet;
    }
  };

  return (
    <SoundContext.Provider value={{ playPad, updatePadLoop, updatePadVolume, updatePadReverb }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
