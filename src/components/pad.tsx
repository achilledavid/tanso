"use client"

import { Volume2 } from "lucide-react";
import { Button } from "./ui/button/button";
import { useSelectedPad } from "@/contexts/selected-pad";
import { cn } from "@/lib/utils";
import { useSound } from "@/contexts/sound-context";

export default function Pad({ pad }: { pad: Pad }) {
    const { selectPad, isSelected } = useSelectedPad();
    const { playPad } = useSound();

    const handleClick = () => {
        if (!isSelected(pad.id)) selectPad(pad);
        playPad(pad);
    }

    return (
        <Button
            size="icon"
            variant={pad.url ? "default" : "outline"}
            onClick={handleClick}
            className={cn("relative", isSelected(pad.id) && "ring-2 ring-ring ring-offset-2")}
        >
            <Volume2 />
            {pad.keyBinding && (
                <span className="absolute top-0 right-0 bg-secondary text-secondary-foreground text-xs rounded px-1 flex items-center justify-center transform translate-x-1/4 -translate-y-1/4">
                    {pad.keyBinding.toUpperCase()}
                </span>
            )}
        </Button>
    )
}
