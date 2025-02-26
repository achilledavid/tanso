import { useRef, useState, useCallback, useEffect } from 'react';
import { Howl } from 'howler';
import { useSoundContext } from '@/contexts/SoundContext';

export function useSoundPlayer(soundFile: string, padId: string) {
    const soundRef = useRef<Howl | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const { toggleActiveSound } = useSoundContext();

    useEffect(() => {
        soundRef.current = new Howl({
            src: [soundFile],
            volume: 1,
            onend: () => {
                setIsPlaying(false);
                toggleActiveSound(padId, false);
            },
        });

        return () => {
            soundRef.current?.unload();
        };
    }, [soundFile, padId, toggleActiveSound]);

    const play = useCallback(() => {
        if (isPlaying) {
            soundRef.current?.stop();
            setIsPlaying(false);
            toggleActiveSound(padId, false);
        } else {
            soundRef.current?.play();
            setIsPlaying(true);
            toggleActiveSound(padId, true);
        }
    }, [isPlaying, padId, toggleActiveSound]);

    const stop = useCallback(() => {
        soundRef.current?.stop();
        setIsPlaying(false);
        toggleActiveSound(padId, false);
    }, [padId, toggleActiveSound]);

    return { isPlaying, play, stop };
}