"use client"
import { useSelectedPad } from "@/contexts/selected-pad";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { updatePadIsLooped } from "@/lib/pad";
import { useState } from "react";
import { isUndefined } from "lodash";
import { useSound } from "@/contexts/sound-context";

export default function Loop({ projectUuid }: { projectUuid: string }) {
  const queryClient = useQueryClient();
  const { selectedPad, selectPad } = useSelectedPad();
  const [isChecked, setIsChecked] = useState<boolean>();
  const { updatePadLoop } = useSound();

  const updatePadMutation = useMutation({
    mutationFn: async ({ pad, isLooped }: { pad: Pad, isLooped: boolean }) => {
      await updatePadIsLooped(pad, isLooped, projectUuid);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-pads', projectUuid] }).then(() => {
        const updatedPad = {
          ...selectedPad!,
          ...variables,
        };
        selectPad(updatedPad);
        updatePadLoop(updatedPad);
      });
    },
    onError: () => {
      setIsChecked(selectedPad?.isLooped || false);
    }
  });

  function handleCheckChange(checked: boolean) {
    if (!selectedPad) return;
    setIsChecked(checked);
    updatePadMutation.mutate({ pad: selectedPad, isLooped: checked });
  }

  if (!selectedPad) return;

  return (
    <div className="flex items-center space-x-2 my-2">
      <Switch
        id="is-looped"
        checked={isUndefined(isChecked) ? selectedPad.isLooped : isChecked}
        onCheckedChange={handleCheckChange}
        disabled={updatePadMutation.isPending}
      />
      <Label htmlFor="is-looped">Loop</Label>
    </div>
  )
}
