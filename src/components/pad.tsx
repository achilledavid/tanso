"use client"

import { Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import { Howl } from 'howler';
import { useSelectedPad } from "@/contexts/selected-pad";
import { useEffect, useState } from "react";

export default function Pad({ pad }: { pad: Pad }) {
    const { selectPad, isSelected } = useSelectedPad();
    const [sound, setSound] = useState<Howl | null>(null);

    useEffect(() => {
        setSound(new Howl({
            src: pad.url,
            volume: 1,
        }));
    }, [pad.url]);

    const handleSoundPlay = () => {
        if (!sound) return;
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