"use client"

import { Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import { Howl } from 'howler';
import { useSelectedPad } from "@/contexts/selected-pad";

export default function Pad({ pad }: { pad: Pad }) {
    const { selectPad, isSelected } = useSelectedPad();

    const sound = new Howl({
        src: pad.url,
        volume: 1,
    });

    const handleSoundPlay = () => {
        if (!isSelected(pad.id)) selectPad(pad);
        sound.stop();
        sound.play();
    };

    return (
        <Button size="icon" onClick={handleSoundPlay}>
            <Volume2 />
        </Button>
    )
}