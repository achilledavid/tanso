import { useEffect } from 'react';
import { useSound } from '@/contexts/sound-context';

export function useKeyboardShortcuts(pads: Pad[] = []) {
  const { playPad } = useSound();

  useEffect(() => {
    // Si aucun pad n'est fourni, ne pas activer les raccourcis
    if (!pads || pads.length === 0) {
      return;
    }

    const keyPressTracker = new Map<string, boolean>();
    const padMap = new Map<string, Pad>();

    pads.forEach(pad => {
      if (pad.keyBinding) {
        padMap.set(pad.keyBinding.toUpperCase(), pad);
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

      if (!e.key) return;

      const key = e.key.toUpperCase();
      const pad = padMap.get(key);

      if (pad && !keyPressTracker.get(key)) {
        keyPressTracker.set(key, true);
        playPad(pad);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.key) return;
      const key = e.key.toUpperCase();
      keyPressTracker.set(key, false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pads, playPad]);
}
