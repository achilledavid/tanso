"use client"

import { useSelectedPad } from "@/contexts/selected-pad";
import { Button } from "../ui/button/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import Library from "../library/library";
import { ListBlobResultBlob } from "@vercel/blob";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deletePadFile, updatePadFile } from "@/lib/pad";
import { useSession } from "next-auth/react";

export default function LinkedFile({ projectUuid }: { projectUuid: string }) {
  const session = useSession();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { selectedPad, selectPad } = useSelectedPad();

  const updatePadMutation = useMutation({
    mutationFn: async ({ pad, url, path }: { pad: Pad, url: string, path: string }) => {
      await updatePadFile(pad, url, projectUuid, path);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-pads', projectUuid] }).then(() => {
        selectPad({
          ...selectedPad!,
          fileName: variables.path.split('/').pop() || '',
          url: variables.url
        });
        setOpen(false);
      });
    }
  });

  const deletePadFileMutation = useMutation({
    mutationFn: async ({ pad }: { pad: Pad }) => {
      await deletePadFile(pad, projectUuid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-pads', projectUuid] }).then(() => {
        selectPad({
          ...selectedPad!,
          fileName: '',
          url: ''
        });
      });
    }
  });

  function handleFileRemove() {
    if (!selectedPad) return;
    deletePadFileMutation.mutate({ pad: selectedPad });
  }

  function handleSelect(file: ListBlobResultBlob) {
    if (!selectedPad) return;
    updatePadMutation.mutate({ pad: selectedPad, url: file.url, path: file.pathname });
  }

  if (!selectedPad) return;

  return (
    <div className="flex flex-col gap-2">
      <Label>linked file</Label>
      {selectedPad.fileName && <Input value={selectedPad.fileName} readOnly />}
      {session.data?.user.username && (
        <div className="flex gap-2 ml-auto">
          {selectedPad.fileName && <Button size="sm" variant="destructive" onClick={handleFileRemove}>remove</Button>}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="secondary" className="w-fit ml-auto">{selectedPad.fileName ? "change" : "add"}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>change linked file</DialogTitle>
              <Library folder={session.data?.user.username} onSelect={handleSelect} />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}
