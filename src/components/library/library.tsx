"use client"

import { useQuery } from "@tanstack/react-query";
import { ListBlobResultBlob } from "@vercel/blob";
import FileImport from "./file-import";
import { getLibrary } from "@/lib/library";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Fragment } from "react";

export default function Library({ onSelect }: { onSelect?: (file: ListBlobResultBlob) => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['library'],
    queryFn: () => getLibrary(),
  });

  return (
    <Fragment>
      <p>my library</p>
      <div>
        {(!isLoading && data) && <DataTable data={data.files} columns={columns} />}
        <FileImport />
      </div>
    </Fragment>
  );
}