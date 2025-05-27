"use client"
import { useSelectedPad } from "@/contexts/selected-pad";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Label } from "../ui/label";
import { updatePadSpeed as updateSpeed } from "@/lib/pad";
import { useEffect, useState } from "react";
import { useSound } from "@/contexts/sound-context";
import { Gauge, Loader2 } from "lucide-react";
import { Slider } from "../ui/slider";

export default function Speed({ projectUuid }: { projectUuid: string }) {
  const queryClient = useQueryClient();
  const { selectedPad, selectPad } = useSelectedPad();
  const { updatePasSpeed } = useSound();
  const [sliderValue, setSliderValue] = useState<number[]>([selectedPad?.speed ?? 0]);

  useEffect(() => {
    if (selectedPad) {
      setSliderValue([selectedPad.speed]);
    }
  }, [selectedPad]);

  const updatePadMutation = useMutation({
    mutationFn: async ({ pad, speed }: { pad: Pad, speed: number }) => {
      await updateSpeed(pad, speed, projectUuid);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-pads', projectUuid] }).then(() => {
        const updatedPad = {
          ...selectedPad!,
          ...variables,
        };
        selectPad(updatedPad);
        updatePasSpeed(updatedPad);
      });
    }
  });

  function handleSpeedChange(value: number[]) {
    setSliderValue(value);
  }

  function handleSpeedCommit(value: number[]) {
    if (!selectedPad) return;
    const speed = value[0];
    updatePadMutation.mutate({ pad: selectedPad, speed });
  }

  if (!selectedPad) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {updatePadMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Gauge className="h-4 w-4 text-muted-foreground" />
        )}
        <Label htmlFor="speed" className="text-sm font-medium">Speed</Label>
      </div>
      <div className="flex items-center gap-2">
        <Slider
          disabled={updatePadMutation.isPending}
          value={sliderValue}
          min={0.25}
          max={2}
          step={0.05}
          onValueChange={handleSpeedChange}
          onValueCommit={handleSpeedCommit}
        />
        <span className="min-w-[2rem] text-xs text-muted-foreground">
          {Math.round(sliderValue[0] * 100)}%
        </span>
      </div>
    </div>
  );
}
