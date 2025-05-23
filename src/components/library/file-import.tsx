"use client";

import { Input } from "@/components/ui/input";
import { uploadFileToLibrary } from "@/lib/library";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";

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

  return (
    <div className="flex flex-col gap-2">
      <Label>
        {uploadMutation.isPending ? (
          <div className="text-muted-foreground flex items-center gap-1">
            <Loader2 className="animate-spin w-4 h-4" />
            Uploading
          </div>
        ) : (
          <>Upload new file</>
        )}
      </Label>
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
