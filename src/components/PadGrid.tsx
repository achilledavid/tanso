import Pad from "@/components/pad"
import { SOUNDS } from "@/config/sounds"
import { usePadConfigContext } from "@/contexts/PadConfigContext"

export default function PadGrid() {
    const { pads, updatePadShortcut } = usePadConfigContext();

    return (
        <div className="grid grid-cols-3 grid-rows-3 gap-4 w-full max-w-xl">
            {pads.map((pad, index) => (
                <Pad
                    key={pad.id}
                    id={pad.id}
                    soundFile={pad.sound}
                    soundName={SOUNDS[index].name}
                    defaultShortcut={pad.shortcut}
                    onShortcutChange={(newShortcut) => updatePadShortcut(pad.id, newShortcut)}
                />
            ))}
        </div>
    );
}