import React, { createContext, useState, useContext, useCallback } from 'react';
import { Howler } from 'howler';
import { PadInfo } from '@/types';

interface SoundContextType {
    activeSounds: Set<string>;
    toggleActiveSound: (padId: string, isActive: boolean) => void;
    stopAllSounds: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set());

    const toggleActiveSound = useCallback((padId: string, isActive: boolean) => {
        setActiveSounds(prev => {
            const newSet = new Set(prev);
            if (isActive) newSet.add(padId);
            else newSet.delete(padId);
            return newSet;
        });
    }, []);

    const stopAllSounds = useCallback(() => {
        Howler.stop();
        setActiveSounds(new Set());
    }, []);

    return (
        <SoundContext.Provider value={{ activeSounds, toggleActiveSound, stopAllSounds }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSoundContext = () => {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error('useSoundContext must be used within a SoundProvider');
    }
    return context;
};