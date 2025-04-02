"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ListBlobResultBlob } from "@vercel/blob";
import FileImport from "./file-import";
import { getLibraryByFolderName, deleteLibraryFiles } from "@/lib/library";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Fragment, useState } from "react";
import { isEmpty } from "lodash";
import { RowSelectionState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button/button";

export default function Library({ folder, onSelect }: { folder: string, onSelect?: (file: ListBlobResultBlob) => void }) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['library'],
    queryFn: () => getLibraryByFolderName(folder),
  });

  const deleteFilesMutation = useMutation({
    mutationFn: (files: ListBlobResultBlob[]) => deleteLibraryFiles(files, folder),
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
      {data && (
        <Button
          onClick={handleDeleteSelected}
          variant="destructive"
          size="sm"
          className="w-fit"
          disabled={Object.keys(rowSelection).length === 0 || deleteFilesMutation.isPending}
        >
          {deleteFilesMutation.isPending ? 'deleting...' : 'delete selection'}
        </Button>
      )}
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
      <FileImport folder={folder} />
    </Fragment>
  );
}
