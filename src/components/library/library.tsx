"use client"

import File from "./file";
import { useQuery } from "@tanstack/react-query";
import { ListBlobResultBlob } from "@vercel/blob";
import FileImport from "./file-import";
import { getLibrary } from "@/lib/library";

export default function Library({ onSelect }: { onSelect?: (file: ListBlobResultBlob) => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['library'],
    queryFn: () => getLibrary(),
  });

  if (isLoading || !data) {
    return <p>loading...</p>;
  }

  return (
    <div>
      <ul className="flex flex-col gap-2 mb-2">
        {data.files.map((file) => (
          <li key={JSON.stringify(file)}>
            <File file={file} onSelect={onSelect} />
          </li>
        ))}
      </ul>
      <FileImport />
    </div>
  );
}