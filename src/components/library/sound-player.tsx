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
    if (sound.playing()) sound.stop();
    else sound.play();
  };

  return (
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClick}>
      <Volume2 />
    </Button>
  )
}
