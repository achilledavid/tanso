"use client"
import { useSelectedPad } from "@/contexts/selected-pad";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { updatePadIsLooped } from "@/lib/pad";
import { useEffect, useState } from "react";
import { isUndefined } from "lodash";
import { useSound } from "@/contexts/sound-context";
import { Loader2, Repeat } from "lucide-react";

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

  useEffect(() => {
    setIsChecked(selectedPad?.isLooped)
  }, [selectedPad])

  if (!selectedPad) return;

  return (
    <div className="flex items-center justify-between gap-2 my-2">
      <div className="flex items-center gap-2">
        <Repeat className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="is-looped" className="text-sm font-medium">Loop</Label>
      </div>
      <div className="flex items-center gap-2">
        {updatePadMutation.isPending && (
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        )}
        <Switch
          id="is-looped"
          checked={isUndefined(isChecked) ? selectedPad.isLooped : isChecked}
          onCheckedChange={handleCheckChange}
          disabled={updatePadMutation.isPending}
        />
      </div>
    </div>
  )
}
