"use client"

import { useSelectedPad } from "@/contexts/selected-pad";
import { Button, buttonVariants } from "../ui/button/button";
import { Label } from "../ui/label";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updatePadKeyBinding } from "@/lib/pad";
import { getPadsFromProject } from "@/lib/project";

export default function KeyBinding({ pad, projectUuid }: { pad: Pad, projectUuid: string }) {
  const queryClient = useQueryClient();
  const { selectPad } = useSelectedPad();
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
          ...pad!,
          keyBinding: variables.keyBinding
        });
      });
    }
  });

  function handleStartKeyBinding() {
    setListeningForKey(true);
  }

  function handleKeyBindingChange(e: React.KeyboardEvent) {
    e.preventDefault();

    const key = e.key.toUpperCase();
    if (key === 'ESCAPE') {
      setListeningForKey(false);
      return;
    }

    const keyAlreadyUsed = pads?.some(pad =>
      pad.id !== pad.id &&
      pad.keyBinding?.toUpperCase() === key
    );

    if (keyAlreadyUsed) return;

    updateKeyBindingMutation.mutate({
      pad: pad,
      keyBinding: key
    });
    setListeningForKey(false);
  }

  function handleKeyBindingRemove() {
    setListeningForKey(false);
    updateKeyBindingMutation.mutate({
      pad: pad,
      keyBinding: null
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>keyboard shortcut</Label>
      <div className="flex gap-2">
        {pad.keyBinding && <span className={buttonVariants({ variant: "secondary", size: "icon", className: "!w-fit !px-2 min-w-8 !h-8" })}>{pad.keyBinding}</span>}
        <div className="flex gap-2 ml-auto">
          {pad.keyBinding && <Button size="sm" variant="destructive" onClick={handleKeyBindingRemove}>remove</Button>}
          {!listeningForKey ? (
            <Button size="sm" variant="secondary" onClick={handleStartKeyBinding}>{pad.keyBinding ? "edit" : "add"}</Button>
          ) : (
            <div className={buttonVariants({ size: "sm", variant: "secondary", className: "w-fit ml-auto" })} onKeyDown={handleKeyBindingChange} tabIndex={0} ref={keyBindingRef}>press key...</div>
          )}
        </div>
      </div>
    </div>
  )
}
