"use client";

import { Input } from "@/components/ui/input";
import { uploadFileToLibrary } from "@/lib/library";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function FileImport() {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: uploadFileToLibrary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!e.target.files) {
      throw new Error("No file selected");
    }

    const file = e.target.files[0];
    uploadMutation.mutate(file);
  };

  return (
    <Input
      type="file"
      onChange={handleFileChange}
      accept="audio/*"
      disabled={uploadMutation.isPending}
    />
  );
}
