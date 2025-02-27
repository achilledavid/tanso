import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import { ShortcutContextMenu } from "@/components/ShortcutContextMenu";
import { useSoundPlayer } from "@/hooks/useSoundPlayer";
import { useShortcutAssigner } from "@/hooks/useShortcutAssigner";
import { useKeyboardContext } from "@/contexts/KeyboardContext";
import { useSoundContext } from "@/contexts/SoundContext";
import { usePadConfigContext } from "@/contexts/PadConfigContext";

interface PadProps {
  id: string;
  soundFile: string;
  soundName: string;
  defaultShortcut: string;
  onShortcutChange: (shortcut: string) => void;
}

export default function Pad({
  id,
  soundFile,
  soundName,
  defaultShortcut,
  onShortcutChange
}: PadProps) {
  const { isPlaying, play, stop } = useSoundPlayer(soundFile, id);
  const { currentShortcut, handleAssignShortcut } = useShortcutAssigner(
    defaultShortcut,
    play,
    onShortcutChange
  );
  const { setStopAction } = useKeyboardContext();
  const { stopAllSounds, stopAll, triggerStopAll } = useSoundContext();
  const { pads } = usePadConfigContext();
  const [playing, setPlaying] = useState(isPlaying);

  const handlePlay = useCallback(() => {
    play();
    setPlaying(true);
  }, [play]);

  const handleStop = useCallback(() => {
    stop();
    setPlaying(false);
  }, [stop]);

  useEffect(() => {
    const element = document.getElementById(id);
    if (element) {
      const stopHandler = () => handleStop();
      element.addEventListener('stop-sound', stopHandler);
      return () => {
        element.removeEventListener('stop-sound', stopHandler);
      };
    }
  }, [id, handleStop]);

  useEffect(() => {
    setStopAction(() => {
      stopAllSounds();
      setPlaying(false);
    });
  }, [setStopAction, stopAllSounds]);

  useEffect(() => {
    if (stopAll) {
      handleStop();
      triggerStopAll();
    }
  }, [stopAll, handleStop, triggerStopAll]);

  useEffect(() => {
    setPlaying(isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    const pad = pads.find(p => p.id === id);
    if (pad && pad.shortcut !== currentShortcut) {
      handleAssignShortcut(pad.shortcut);
    }
  }, [pads, id, currentShortcut, handleAssignShortcut]);

  return (
    <div id={id} className="flex flex-col items-center gap-2">
      <ShortcutContextMenu onAssignShortcut={handleAssignShortcut} currentShortcut={currentShortcut}>
        <Button 
          variant={playing ? "destructive" : "default"} 
          size="pads" 
          onClick={handlePlay} 
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
  );
}