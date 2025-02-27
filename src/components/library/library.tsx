"use client"

import { getLibraryByUsername } from "@/lib/library";
import File from "./file";
import { useQuery } from "@tanstack/react-query";
import { ListBlobResultBlob } from "@vercel/blob";
import FileImport from "./file-import";

export default function Library({ onSelect }: { onSelect?: (file: ListBlobResultBlob) => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['library'],
    // TODO: get username from session
    queryFn: () => getLibraryByUsername("achilledavid"),
  });

  if (isLoading || !data) {
    return <div>Loading...</div>;
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