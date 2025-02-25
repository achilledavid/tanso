"use client"

import { useState, useEffect, useCallback } from "react"
import Pad from "./pad"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

// Les raccourcis par défaut pour les pads (jusqu'à 9 pads)
const DEFAULT_SHORTCUTS = ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o']

// Configuration des sons disponibles
const SOUNDS = [
    { name: "Son-1", file: "/Son-1.mp3" },
    { name: "Son-2", file: "/Son-2.mp3" },
    { name: "Piano", file: "/Son-3.mp3" },
    { name: "Bass", file: "/Son-4.mp3" },
    { name: "Guitar", file: "/Son-5.mp3" },
    { name: "Synth", file: "/Son-6.mp3" },
    { name: "Vocal", file: "/Son-7.mp3" },
    { name: "FX", file: "/Son-8.mp3" },
    { name: "Clap", file: "/Sound.mp3" },
]

interface PadInfo {
    id: string;
    sound: string;
    shortcut: string;
}

interface PadGridProps {
    padCount?: number; // Nombre de pads à afficher, par défaut tous
}

export default function PadGrid({ padCount = SOUNDS.length }: PadGridProps) {
    // Limiter à 9 pads maximum
    const actualPadCount = Math.min(padCount, 9);

    const [pads, setPads] = useState<PadInfo[]>([]);
    const { setStopActionHandler } = useKeyboardShortcuts();
    const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set());

    // Initialiser les pads au chargement
    useEffect(() => {
        // Créer les infos de pads avec des raccourcis par défaut
        const initialPads = Array.from({ length: actualPadCount }, (_, index) => ({
            id: `pad-${index}`,
            sound: SOUNDS[index].file,
            shortcut: DEFAULT_SHORTCUTS[index]
        }));

        setPads(initialPads);

        // Charger les raccourcis sauvegardés
        try {
            const savedShortcuts = localStorage.getItem("padShortcuts");
            if (savedShortcuts) {
                const parsedShortcuts = JSON.parse(savedShortcuts);

                // Mettre à jour les pads avec les raccourcis sauvegardés
                setPads(prevPads =>
                    prevPads.map((pad, index) => ({
                        ...pad,
                        shortcut: index < parsedShortcuts.length ? parsedShortcuts[index].shortcut : pad.shortcut
                    }))
                );
            }
        } catch (error) {
            console.error("Erreur lors du chargement des raccourcis:", error);
        }
    }, [actualPadCount]);

    // Enregistrer les raccourcis quand ils changent
    useEffect(() => {
        if (pads.length > 0) {
            const shortcutsToSave = pads.map(pad => ({
                id: pad.id,
                shortcut: pad.shortcut
            }));

            localStorage.setItem("padShortcuts", JSON.stringify(shortcutsToSave));
        }
    }, [pads]);

    // Fonction pour arrêter tous les sons
    const stopAllSounds = useCallback(() => {
        // Créer une copie pour éviter les problèmes de mutation pendant l'itération
        const soundsToStop = Array.from(activeSounds);
        soundsToStop.forEach(padId => {
            const padElement = document.getElementById(padId);
            if (padElement) {
                // Simuler un clic sur le bouton stop
                const stopEvent = new CustomEvent('stop-sound');
                padElement.dispatchEvent(stopEvent);
            }
        });
        setActiveSounds(new Set());
    }, [activeSounds]);

    // Configurer le gestionnaire d'arrêt global pour la touche Escape
    useEffect(() => {
        setStopActionHandler(stopAllSounds);
    }, [setStopActionHandler, stopAllSounds]);

    // Mettre à jour un raccourci pour un pad
    const updatePadShortcut = (padId: string, newShortcut: string) => {
        setPads(prevPads =>
            prevPads.map(pad =>
                pad.id === padId ? { ...pad, shortcut: newShortcut } : pad
            )
        );
    };

    // Ajouter un son actif
    const addActiveSound = (padId: string) => {
        setActiveSounds(prev => new Set(prev).add(padId));
    };

    // Retirer un son actif
    const removeActiveSound = (padId: string) => {
        setActiveSounds(prev => {
            const newSet = new Set(prev);
            newSet.delete(padId);
            return newSet;
        });
    };

    return (
        <div
            className="grid grid-cols-3 grid-rows-3 gap-4 w-full max-w-xl"
        >
            {pads.map((pad, index) => (
                <Pad
                    key={pad.id}
                    id={pad.id}
                    soundFile={pad.sound}
                    soundName={SOUNDS[index].name}
                    defaultShortcut={pad.shortcut}
                    onShortcutChange={(newShortcut) => updatePadShortcut(pad.id, newShortcut)}
                    onSoundPlay={() => addActiveSound(pad.id)}
                    onSoundStop={() => removeActiveSound(pad.id)}
                />
            ))}
        </div>
    );
}