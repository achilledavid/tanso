"use client";

import { Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import { Howl } from 'howler';
import { useMemo } from 'react';

export default function Pad() {
    const sound = useMemo(() => new Howl({
        src: ['/sound.mp3'],
        volume: 1,
    }), []);

    const handleSoundPlay = () => {
        sound.stop();
        sound.play();
    };

    return (
        <Button size="icon" onClick={handleSoundPlay}>
            <Volume2 />
        </Button>
    )
}