import React, { createContext, useState, useContext, useEffect } from 'react';
import { PadInfo } from '@/types';
import { SOUNDS } from '@/config/sounds';
import { DEFAULT_SHORTCUTS, LOCAL_STORAGE_KEY } from '@/config/keyboard';

interface PadConfigContextType {
    pads: PadInfo[];
    updatePadShortcut: (padId: string, newShortcut: string) => void;
}

const PadConfigContext = createContext<PadConfigContextType | undefined>(undefined);

export const PadConfigProvider: React.FC<{ 
    children: React.ReactNode;
    padCount?: number;
}> = ({ children, padCount = SOUNDS.length }) => {
    const actualPadCount = Math.min(padCount, 9);
    const [pads, setPads] = useState<PadInfo[]>([]);

    useEffect(() => {
        const initialPads = Array.from({ length: actualPadCount }, (_, index) => ({
            id: `pad-${index}`,
            sound: SOUNDS[index].file,
            shortcut: DEFAULT_SHORTCUTS[index]
        }));

        try {
            const savedShortcuts = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedShortcuts) {
                const parsedShortcuts = JSON.parse(savedShortcuts);
                initialPads.forEach((pad, index) => {
                    if (index < parsedShortcuts.length) pad.shortcut = parsedShortcuts[index].shortcut;
                });
            }
        } catch (error) {
            console.error("Erreur lors du chargement des raccourcis:", error);
        }

        setPads(initialPads);
    }, [actualPadCount]);

    useEffect(() => {
        if (pads.length > 0) {
            const shortcutsToSave = pads.map(pad => ({
                id: pad.id,
                shortcut: pad.shortcut
            }));
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(shortcutsToSave));
        }
    }, [pads]);

    const updatePadShortcut = (padId: string, newShortcut: string) => {
        setPads(prevPads =>
            prevPads.map(pad =>
                pad.id === padId ? { ...pad, shortcut: newShortcut } : pad
            )
        );
    };

    return (
        <PadConfigContext.Provider value={{ pads, updatePadShortcut }}>
            {children}
        </PadConfigContext.Provider>
    );
};

export const usePadConfigContext = () => {
    const context = useContext(PadConfigContext);
    if (context === undefined) {
        throw new Error('usePadConfigContext must be used within a PadConfigProvider');
    }
    return context;
};