"use client"
import { useSelectedPad } from "@/contexts/selected-pad";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Label } from "../ui/label";
import { updatePadReverb as updateReverb } from "@/lib/pad";
import { useEffect, useState } from "react";
import { useSound } from "@/contexts/sound-context";
import { Loader2 } from "lucide-react";
import { Slider } from "../ui/slider";

export default function Reverb({ projectUuid }: { projectUuid: string }) {
  const queryClient = useQueryClient();
  const { selectedPad, selectPad } = useSelectedPad();
  const { updatePadReverb } = useSound();
  const [sliderValue, setSliderValue] = useState<number[]>([selectedPad?.reverb || 0]);

  useEffect(() => {
    if (selectedPad) {
      setSliderValue([selectedPad.reverb]);
    }
  }, [selectedPad]);

  const updatePadMutation = useMutation({
    mutationFn: async ({ pad, reverb }: { pad: Pad, reverb: number }) => {
      await updateReverb(pad, reverb, projectUuid);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-pads', projectUuid] }).then(() => {
        const updatedPad = {
          ...selectedPad!,
          ...variables,
        };
        selectPad(updatedPad);
        updatePadReverb(updatedPad);
      });
    }
  });

  function handleReverbChange(value: number[]) {
    setSliderValue(value);
  }

  function handleReverbCommit(value: number[]) {
    if (!selectedPad) return;

    const reverb = value[0];

    if (reverb < 0 || reverb > 1) return;
    updatePadMutation.mutate({ pad: selectedPad, reverb: reverb });
  }

  if (!selectedPad) return;

  return (
    <div className="flex flex-col gap-2 my-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="reverb-slider" className="text-sm font-medium">Reverb</Label>
      </div>
      <div className="flex items-center gap-2">
        {updatePadMutation.isPending && (
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        )}
        <Slider
          id="reverb-slider"
          disabled={updatePadMutation.isPending}
          value={sliderValue}
          min={0}
          max={1}
          step={0.1}
          onValueChange={handleReverbChange}
          onValueCommit={handleReverbCommit}
        />
      </div>
    </div>
  )
}
