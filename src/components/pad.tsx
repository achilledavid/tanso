"use client"

import { Button } from "@/components/ui/button"
import { Howl } from "howler"
import { useMemo, useCallback, useEffect, useState, useRef } from "react"
import { ShortcutContextMenu } from "@/components/shortcut-context-menu"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

interface PadProps {
  id: string;
  soundFile: string;
  soundName: string;
  defaultShortcut: string;
  onShortcutChange: (shortcut: string) => void;
  onSoundPlay: () => void;
  onSoundStop: () => void;
}

const DISALLOWED_SHORTCUTS = [" ", "Space"];

export default function Pad({
  id,
  soundFile,
  soundName,
  defaultShortcut,
  onShortcutChange,
  onSoundPlay,
  onSoundStop
}: PadProps) {
  const soundRef = useRef<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentShortcut, setCurrentShortcut] = useState<string>(defaultShortcut);
  const { assignShortcut, clearShortcut } = useKeyboardShortcuts();

  useEffect(() => {
    soundRef.current = new Howl({
      src: [soundFile],
      volume: 1,
      onend: () => {
        setIsPlaying(false);
        onSoundStop();
      },
    });
  }, [soundFile, onSoundStop]);

  const handleSoundPlay = useCallback(() => {
    if (isPlaying) {
      soundRef.current?.stop();
      setIsPlaying(false);
      onSoundStop();
    } else {
      soundRef.current?.play();
      setIsPlaying(true);
      onSoundPlay();
    }
  }, [isPlaying, onSoundPlay, onSoundStop]);

  const handleSoundStop = useCallback(() => {
    soundRef.current?.stop();
    setIsPlaying(false);
    onSoundStop();
  }, [onSoundStop]);

  const handleAssignShortcut = useCallback(
    (key: string) => {
      if (DISALLOWED_SHORTCUTS.includes(key)) return;
      
      clearShortcut(currentShortcut);
      assignShortcut(key, handleSoundPlay);
      setCurrentShortcut(key);
      onShortcutChange(key);
    },
    [assignShortcut, clearShortcut, currentShortcut, handleSoundPlay, onShortcutChange]
  );

  useEffect(() => {
    if (defaultShortcut !== currentShortcut && defaultShortcut) {
      clearShortcut(currentShortcut);
      assignShortcut(defaultShortcut, handleSoundPlay);
      setCurrentShortcut(defaultShortcut);
    }
  }, [defaultShortcut, currentShortcut, assignShortcut, clearShortcut, handleSoundPlay]);

  useEffect(() => {
    const element = document.getElementById(id);
    if (element) {
      const stopHandler = () => handleSoundStop();
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
