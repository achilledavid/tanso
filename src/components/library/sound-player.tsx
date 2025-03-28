"use client"

import { ListBlobResultBlob } from "@vercel/blob";
import { Volume2 } from "lucide-react";
import { Howl } from 'howler';
import { Button } from "../ui/button/button";

export function SoundPlayer({ file }: { file: ListBlobResultBlob }) {
  const sound = new Howl({
    src: file.url,
    volume: 1,
  });

  const handleClick = () => {
    if (!sound) return;
    sound.stop();
    sound.play();
  };

  return (
    <Button variant="secondary" size="icon" className="h-8 w-8" onClick={handleClick}>
      <Volume2 stroke="black" />
    </Button>
  )
}
