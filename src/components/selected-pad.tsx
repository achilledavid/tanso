"use client"

import { useSelectedPad } from "@/contexts/selected-pad";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Fragment, useState } from "react";
import Library from "./library/library";
import { ListBlobResultBlob } from "@vercel/blob";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePad } from "@/lib/pad";

export default function SelectedPad({ projectId }: { projectId: number }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { selectedPad } = useSelectedPad();

  const updatePadMutation = useMutation({
    mutationFn: async ({ pad, url }: { pad: Pad, url: string }) => {
      await updatePad(pad, url, projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-pads', projectId] }).then(() => {
        setOpen(false);
      });
    }
  });

  if (!selectedPad) return (
    <p>No pad selected</p>
  );

  function handleSelect(file: ListBlobResultBlob) {
    if (!selectedPad) return;
    updatePadMutation.mutate({ pad: selectedPad, url: file.url });
  }

  return (
    <Fragment>
      <p>pad n°{selectedPad.id}</p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="secondary" className="w-fit">change sound</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>my library</DialogTitle>
          <Library onSelect={handleSelect} />
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}