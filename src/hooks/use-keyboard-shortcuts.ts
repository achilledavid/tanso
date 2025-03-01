import { useEffect } from 'react';
import { Howl } from 'howler';

export function useKeyboardShortcuts(pads: Pad[] | undefined) {
  useEffect(() => {
    if (!pads || pads.length === 0) return;

    const soundMap = new Map<string, Howl>();
    const keyPressTracker = new Map<string, boolean>();

    pads.forEach(pad => {
      if (pad.keyBinding && pad.url) {
        soundMap.set(pad.keyBinding.toUpperCase(), new Howl({
          src: pad.url,
          volume: 1,
        }));
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLSelectElement
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      const sound = soundMap.get(key);

      if (sound && !keyPressTracker.get(key)) {
        keyPressTracker.set(key, true);
        sound.stop();
        sound.play();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      keyPressTracker.set(key, false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pads]);
} 