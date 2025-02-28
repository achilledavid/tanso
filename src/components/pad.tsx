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
        if (!pad.url) return;
        setSound(new Howl({
            src: pad.url,
            volume: 1,
        }));
    }, [pad.url]);

    const handleClick = () => {
        if (!isSelected(pad.id)) selectPad(pad);
        handleSoundPlay();
    }

    const handleSoundPlay = () => {
        if (!sound) return;
        sound.stop();
        sound.play();
    };

    return (
        <Button size="icon" variant={pad.url ? "default" : "secondary"} onClick={handleClick}>
            <Volume2 />
        </Button>
    )
}