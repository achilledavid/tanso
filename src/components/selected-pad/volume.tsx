"use client"
import { useSelectedPad } from "@/contexts/selected-pad";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Label } from "../ui/label";
import { updatePadVolume as updateVolume } from "@/lib/pad";
import { useEffect, useState } from "react";
import { useSound } from "@/contexts/sound-context";
import { Loader2, Volume2 } from "lucide-react";
import { Slider } from "../ui/slider";

export default function Volume({ projectUuid }: { projectUuid: string }) {
  const queryClient = useQueryClient();
  const { selectedPad, selectPad } = useSelectedPad();
  const { updatePadVolume } = useSound();
  const [sliderValue, setSliderValue] = useState<number[]>([selectedPad?.volume || 0]);

  useEffect(() => {
    if (selectedPad) {
      setSliderValue([selectedPad.volume]);
    }
  }, [selectedPad]);

  const updatePadMutation = useMutation({
    mutationFn: async ({ pad, volume }: { pad: Pad, volume: number }) => {
      await updateVolume(pad, volume, projectUuid);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-pads', projectUuid] }).then(() => {
        const updatedPad = {
          ...selectedPad!,
          ...variables,
        };
        selectPad(updatedPad);
        updatePadVolume(updatedPad);
      });
    }
  });

  function handleVolumeChange(value: number[]) {
    setSliderValue(value);
  }

  function handleVolumeCommit(value: number[]) {
    if (!selectedPad) return;

    const volume = value[0];

    if (volume < 0 || volume > 1) return;
    updatePadMutation.mutate({ pad: selectedPad, volume: volume });
  }

  if (!selectedPad) return;

  return (
    <div className="flex md:flex-col gap-2 my-2">
      <div className="flex items-center gap-2">
        {updatePadMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Volume2 className="h-4 w-4 text-muted-foreground" />
        )}
        <Label htmlFor="is-looped" className="text-sm font-medium">Volume</Label>
      </div>
      <div className="flex items-center gap-2 w-full">
        {updatePadMutation.isPending && (
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        )}
        <Slider
          disabled={updatePadMutation.isPending}
          value={sliderValue}
          min={0}
          max={1}
          step={0.05}
          onValueChange={handleVolumeChange}
          onValueCommit={handleVolumeCommit}
        />
        <span className="min-w-[2rem] text-xs text-muted-foreground">
          {Math.round(sliderValue[0] * 100)}%
        </span>
      </div>
    </div>
  )
}
