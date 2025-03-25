"use client"

import { useSelectedPad } from "@/contexts/selected-pad";
import { Button, buttonVariants } from "../ui/button/button";
import { Label } from "../ui/label";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updatePadKeyBinding } from "@/lib/pad";
import { getPadsFromProject } from "@/lib/project";

export default function KeyBinding({ projectUuid }: { projectUuid: string }) {
  const queryClient = useQueryClient();
  const { selectedPad, selectPad } = useSelectedPad();
  const [listeningForKey, setListeningForKey] = useState(false);
  const keyBindingRef = useRef<HTMLDivElement>(null);

  const { data: pads } = useQuery({
    queryKey: ['project-pads', projectUuid],
    queryFn: () => getPadsFromProject(projectUuid),
  });

  useEffect(() => {
    if (listeningForKey && keyBindingRef.current) {
      keyBindingRef.current.focus();
    }
  }, [listeningForKey]);

  const updateKeyBindingMutation = useMutation({
    mutationFn: async ({ pad, keyBinding }: { pad: Pad, keyBinding: string | null }) => {
      await updatePadKeyBinding(pad, keyBinding, projectUuid);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-pads', projectUuid] }).then(() => {
        selectPad({
          ...selectedPad!,
          keyBinding: variables.keyBinding
        });
      });
    }
  });

  function handleStartKeyBinding() {
    setListeningForKey(true);
  }

  function handleKeyBindingChange(e: React.KeyboardEvent) {
    if (!selectedPad) return;
    e.preventDefault();

    const key = e.key.toUpperCase();
    if (key === 'ESCAPE') {
      setListeningForKey(false);
      return;
    }

    const keyAlreadyUsed = pads?.some(pad =>
      pad.id !== selectedPad.id &&
      pad.keyBinding?.toUpperCase() === key
    );

    if (keyAlreadyUsed) return;

    updateKeyBindingMutation.mutate({
      pad: selectedPad,
      keyBinding: key
    });
    setListeningForKey(false);
  }

  function handleKeyBindingRemove() {
    if (!selectedPad) return;
    setListeningForKey(false);
    updateKeyBindingMutation.mutate({
      pad: selectedPad,
      keyBinding: null
    });
  }

  if (!selectedPad) return null;

  return (
    <div className="flex flex-col gap-2">
      <Label>keyboard shortcut</Label>
      <div className="flex gap-2">
        {selectedPad.keyBinding && <span className={buttonVariants({ variant: "outline", size: "icon", className: "!w-fit !px-2 min-w-8 !h-8" })}>{selectedPad.keyBinding}</span>}
        <div className="flex gap-2 ml-auto">
          {selectedPad.keyBinding && <Button size="sm" variant="destructive" onClick={handleKeyBindingRemove}>remove</Button>}
          {!listeningForKey ? (
            <Button size="sm" variant="secondary" onClick={handleStartKeyBinding}>{selectedPad.keyBinding ? "edit" : "add"}</Button>
          ) : (
            <div className={buttonVariants({ size: "sm", variant: "secondary", className: "w-fit ml-auto" })} onKeyDown={handleKeyBindingChange} tabIndex={0} ref={keyBindingRef}>press key...</div>
          )}
        </div>
      </div>
    </div>
  )
}
