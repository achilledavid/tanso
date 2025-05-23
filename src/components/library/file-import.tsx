"use client";

import { Input } from "@/components/ui/input";
import { uploadFileToLibrary } from "@/lib/library";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Label } from "../ui/label";

export default function FileImport() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: uploadFileToLibrary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!e.target.files) {
      throw new Error("No file selected");
    }

    const files = e.target.files;
    uploadMutation.mutate(files);
  };

  return uploadMutation.isPending ? (
    <p>Uploading...</p>
  ) : (
    <div className="flex flex-col gap-2">
      <Label>Upload new file</Label>
      <Input
        multiple
        type="file"
        onChange={handleFileChange}
        accept="audio/*"
        disabled={uploadMutation.isPending}
        ref={fileInputRef}
      />
    </div>
  );
}
