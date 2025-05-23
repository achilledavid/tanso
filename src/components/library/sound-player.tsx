"use client"

import { ListBlobResultBlob } from "@vercel/blob";
import { Volume2 } from "lucide-react";
import { Howl } from 'howler';
import { Button } from "../ui/button/button";
import { useRef } from "react";

export function SoundPlayer({ file }: { file: ListBlobResultBlob }) {
  const soundRef = useRef<Howl | null>(null);

  if (!soundRef.current) {
    soundRef.current = new Howl({
      src: file.url,
      volume: 1,
    });
  }

  const handleClick = () => {
    const sound = soundRef.current;
    if (!sound) return;
    if (sound.playing() && sound.duration() > 1) {
      sound.stop();
    } else {
      sound.stop();
      sound.play();
    }
  };

  return (
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClick}>
      <Volume2 />
    </Button>
  );
}
