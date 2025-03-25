"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ListBlobResultBlob } from "@vercel/blob";
import FileImport from "./file-import";
import { getLibrary, deleteLibraryFiles } from "@/lib/library";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Fragment, useState } from "react";
import { isEmpty } from "lodash";
import { RowSelectionState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button/button";

export default function Library({ onSelect }: { onSelect?: (file: ListBlobResultBlob) => void }) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['library'],
    queryFn: () => getLibrary(),
  });

  const deleteFilesMutation = useMutation({
    mutationFn: deleteLibraryFiles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
      setRowSelection({});
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression des fichiers:', error);
    }
  });

  const handleDeleteSelected = () => {
    const selectedFiles = Object.keys(rowSelection).map(
      index => data?.files[parseInt(index)]
    ).filter((file): file is ListBlobResultBlob => file !== undefined);

    if (selectedFiles.length > 0) {
      deleteFilesMutation.mutate(selectedFiles);
    }
  };

  return (
    <Fragment>
      <div className="flex justify-between items-center">
        <h2>my library</h2>
        {data && (
          <Button
            onClick={handleDeleteSelected}
            variant="destructive"
            size="sm"
            disabled={Object.keys(rowSelection).length === 0 || deleteFilesMutation.isPending}
          >
            {deleteFilesMutation.isPending ? 'deleting...' : 'delete selection'}
          </Button>
        )}
      </div>
      {isLoading ? (
        <p>loading...</p>
      ) : (
        !data?.files || isEmpty(data.files) ? (
          <p>no files found in your library</p>
        ) : (
          <>
            <DataTable
              data={data.files}
              columns={columns}
              onSelect={onSelect}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
          </>
        )
      )}
      <FileImport />
    </Fragment>
  );
}
