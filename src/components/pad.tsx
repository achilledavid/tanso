import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { ShortcutContextMenu } from "@/components/ShortcutContextMenu"
import { useSoundPlayer } from "@/hooks/useSoundPlayer"
import { useShortcutAssigner } from "@/hooks/useShortcutAssigner"
import { useKeyboardContext } from "@/contexts/KeyboardContext"
import { useSoundContext } from "@/contexts/SoundContext"

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
  const { stopAllSounds } = useSoundContext();

  useEffect(() => {
    const element = document.getElementById(id);
    if (element) {
      const stopHandler = () => stop();
      element.addEventListener('stop-sound', stopHandler);
      return () => {
        element.removeEventListener('stop-sound', stopHandler);
      };
    }
  }, [id, stop]);

  useEffect(() => {
    setStopAction(stopAllSounds);
  }, [setStopAction, stopAllSounds]);

  return (
    <div id={id} className="flex flex-col items-center gap-2">
      <ShortcutContextMenu onAssignShortcut={handleAssignShortcut} currentShortcut={currentShortcut}>
        <Button 
          variant={isPlaying ? "destructive" : "default"} 
          size="pads" 
          onClick={play} 
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