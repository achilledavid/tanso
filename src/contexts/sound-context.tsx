import { Howl } from 'howler';
import { createContext, useContext, useEffect, useRef } from 'react';
import { playSound } from '@/lib/pad';

type SoundContextType = {
  playPad: (pad: Pad) => void;
  updatePadLoop: (pad: Pad) => void;
  updatePadVolume: (pad: Pad) => void;
};

const SoundContext = createContext<SoundContextType | null>(null);

const soundMap = new Map<string, Howl>();

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

  return (
    <SoundContext.Provider value={{ playPad, updatePadLoop, updatePadVolume }}>
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
