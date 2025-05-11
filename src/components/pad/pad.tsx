"use client"

import { useSelectedPad } from "@/contexts/selected-pad";
import { cn } from "@/lib/utils";
import { useSound } from "@/contexts/sound-context";
import style from "./pad.module.scss"
import { HeadphoneOff, Repeat } from "lucide-react";

export default function Pad({ pad }: { pad: Pad }) {
  const { selectPad, isSelected } = useSelectedPad();
  const { playPad } = useSound();

  const handleClick = () => {
    if (!isSelected(pad.id)) selectPad(pad);
    playPad(pad);
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        style.container,
        isSelected(pad.id) && style.selected
      )}
    >
      <div className={style.content}>
        {pad.fileName ? (
          <span className={style.file}>
            {pad.fileName}
          </span>
        ) : (
          <span className={style.empty}>
            <HeadphoneOff size={14} />
            no file
          </span>
        )}
        <div className={style.footer}>
          {pad.isLooped && (
            <span className={style.loop}>
              <Repeat size={14} />
            </span>
          )}
          {pad.keyBinding && (
            <span className={style.key}>
              {pad.keyBinding.toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
