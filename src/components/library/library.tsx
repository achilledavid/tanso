"use client"

import { useQuery } from "@tanstack/react-query";
import { ListBlobResultBlob } from "@vercel/blob";
import FileImport from "./file-import";
import { getLibrary } from "@/lib/library";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Fragment } from "react";
import { isEmpty } from "lodash";

export default function Library({ onSelect }: { onSelect?: (file: ListBlobResultBlob) => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['library'],
    queryFn: () => getLibrary(),
  });

  return (
    <Fragment>
      <p>my library</p>
      <div className="space-y-2">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          data && (
            isEmpty(data.files) ? (
              <p>No files found</p>
            ) : (
              <DataTable data={data.files} columns={columns} onSelect={onSelect} />
            ))
        )}
      </div>
      <FileImport />
    </Fragment>
  );
}
