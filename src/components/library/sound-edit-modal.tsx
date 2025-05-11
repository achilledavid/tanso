"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { SoundEdit } from "@/components/library/sound-edit";
import type { ListBlobResultBlob } from "@vercel/blob";

interface SoundEditModalProps {
  file: ListBlobResultBlob;
  onSave: (blob: Blob, fileName: string) => void;
  trigger: React.ReactNode;
}

export default function SoundEditModal({ file, trigger, onSave }: SoundEditModalProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && file.url) {
      setLoading(true);
      fetch(file.url)
        .then(res => res.blob())
        .then(blob => {
          const fileName = file.pathname.split('/').pop() || 'sound';
          const f = new File([blob], fileName, { type: blob.type });
          setAudioFile(f);
        })
        .catch(err => {
          console.error('loading file error:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, file]);

  const handleSave = async (processedBlob: Blob, fileName: string) => {
    try {
      const finalFileName = fileName.endsWith('.wav') ? fileName : `${fileName}.wav`;
      await onSave(processedBlob, finalFileName);
      setOpen(false);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogTitle>Edit sound</DialogTitle>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : audioFile ? (
          <SoundEdit
            file={audioFile}
            onSave={handleSave}
          />
        ) : (
          <p>loading...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}