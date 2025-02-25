"use client"

import { Button } from "@/components/ui/button"
import { Howl } from "howler"
import { useMemo, useCallback, useEffect, useState, useRef } from "react"
import { ShortcutContextMenu } from "@/components/shortcut-context-menu"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { clear } from "console"

interface PadProps {
  id: string;
  soundFile: string;
  soundName: string;
  defaultShortcut: string;
  onShortcutChange: (shortcut: string) => void;
  onSoundPlay: () => void;
  onSoundStop: () => void;
}

export default function Pad({
  id,
  soundFile,
  soundName,
  defaultShortcut,
  onShortcutChange,
  onSoundPlay,
  onSoundStop
}: PadProps) {
  const sound = useMemo(
    () =>
      new Howl({
        src: [soundFile],
        volume: 1,
        onend: () => {
          setIsPlaying(false);
          onSoundStop();
        }
      }),
    [soundFile, onSoundStop],
  )

  const { assignShortcut, clearShortcut } = useKeyboardShortcuts()
  const [currentShortcut, setCurrentShortcut] = useState<string>(defaultShortcut)
  const [isPlaying, setIsPlaying] = useState(false)
  const isInitialized = useRef(false)

  const handleSoundPlay = useCallback(() => {
    if (isPlaying) {
      sound.stop()
      setIsPlaying(false)
      onSoundStop()
    } else {
      sound.play()
      setIsPlaying(true)
      onSoundPlay()
    }
  }, [sound, isPlaying, onSoundPlay, onSoundStop])

  const handleSoundStop = useCallback(() => {
    sound.stop()
    setIsPlaying(false)
    onSoundStop()
  }, [sound, onSoundStop])

  const handleAssignShortcut = useCallback(
    (key: string) => {
      // Ne pas permettre d'assigner Escape comme raccourci
      if (key === " " || key === "Space") return;
      
    clearShortcut(currentShortcut)
      assignShortcut(key, handleSoundPlay)
      setCurrentShortcut(key)
      onShortcutChange(key)
    },
    [assignShortcut, clearShortcut, currentShortcut, handleSoundPlay, onShortcutChange],
  )

  // Initialiser le raccourci au montage
  useEffect(() => {
    if (isInitialized.current) return;
    
    if (defaultShortcut) {
      assignShortcut(defaultShortcut, handleSoundPlay)
      setCurrentShortcut(defaultShortcut)
    }
    
    isInitialized.current = true;
  }, [defaultShortcut, assignShortcut, handleSoundPlay])

  // Mettre à jour le raccourci si celui par défaut change
  useEffect(() => {
    if (defaultShortcut !== currentShortcut && defaultShortcut) {
        clearShortcut(currentShortcut)
      assignShortcut(defaultShortcut, handleSoundPlay)
      setCurrentShortcut(defaultShortcut)
    }
  }, [defaultShortcut, currentShortcut, assignShortcut, clearShortcut, handleSoundPlay])

  // Écouter l'événement custom pour arrêter le son
  useEffect(() => {
    const element = document.getElementById(id);
    if (element) {
      const stopHandler = () => {
        handleSoundStop();
      };
      
      element.addEventListener('stop-sound', stopHandler);
      return () => {
        element.removeEventListener('stop-sound', stopHandler);
      };
    }
  }, [id, handleSoundStop]);

  return (
    <div id={id} className="flex flex-col items-center gap-2">
      <ShortcutContextMenu onAssignShortcut={handleAssignShortcut} currentShortcut={currentShortcut}>
        <Button 
          variant={isPlaying ? "destructive" : "default"} 
          size="pads" 
          onClick={handleSoundPlay} 
          className="relative w-full"
        >
            <span className="text-sm font-medium">{soundName}</span>
            {currentShortcut && (
              <span className="absolute bottom-2 right-2 text-xs border border-input bg-background text-primary rounded-sm px-2 py-1 mt-1">
                {currentShortcut}
              </span>
            )}
        </Button>
      </ShortcutContextMenu>
    </div>
  )
}