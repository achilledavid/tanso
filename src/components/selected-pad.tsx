"use client"

import { useSelectedPad } from "@/contexts/selected-pad";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import Library from "./library/library";
import { ListBlobResultBlob } from "@vercel/blob";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePad } from "@/lib/pad";

export default function SelectedPad() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { selectedPad } = useSelectedPad();

  const updatePadMutation = useMutation({
    mutationFn: async ({ pad, file }: { pad: Pad, file: ListBlobResultBlob }) => {
      await updatePad(pad, file);
    },
    onSuccess: () => {
      if (!selectedPad) return;
      queryClient.invalidateQueries({ queryKey: ['session', selectedPad.sessionId] }).then(() => {
        setOpen(false);
      });
    }
  });

  if (!selectedPad) return (
    <div>
      <h2>No pad selected</h2>
    </div>
  );

  function handleSelect(file: ListBlobResultBlob) {
    if (!selectedPad) return;
    updatePadMutation.mutate({ pad: selectedPad, file });
  }

  return (
    <div>
      <p>session {selectedPad.sessionId}</p>
      <p>{selectedPad.id}</p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full mt-4" size="sm" variant="secondary">Change sound</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Choose a new file</DialogTitle>
          <Library onSelect={handleSelect} />
        </DialogContent>
      </Dialog>
    </div>
  );
}