"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ListBlobResultBlob } from "@vercel/blob";
import FileImport from "./file-import";
import { getLibraryByFolderName, deleteLibraryFiles } from "@/lib/library";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Fragment, useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { RowSelectionState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button/button";
import LibrarySelector from '@/components/library/library-selector/library-selector';
import { Loader2 } from "lucide-react";

export default function Library({ username, onSelect }: { username: string, onSelect?: (file: ListBlobResultBlob) => void }) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedLibrary, setSelectedLibrary] = useState<string>(username);
  const [isEditable, setIsEditable] = useState(false);
  const [showedColumns, setShowedColumns] = useState(columns);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['library', selectedLibrary],
    queryFn: () => getLibraryByFolderName(selectedLibrary),
  });

  const deleteFilesMutation = useMutation({
    mutationFn: deleteLibraryFiles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library', selectedLibrary] });
      setRowSelection({});
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

  // TODO : add default libraries to blob store
  const libraries = [
    { id: username, name: "My library" },
    { id: "tanso-default-library-bass", name: "Bass" },
    { id: "tanso-default-library-claps", name: "Claps" },
    { id: "tanso-default-library-hats", name: "Hats" },
    { id: "tanso-default-library-kicks", name: "Kicks" },
    { id: "tanso-default-library-one-shots", name: "One shots" },
    { id: "tanso-default-library-rims", name: "Rims" },
    { id: "tanso-default-library-snares", name: "Snares" },
    { id: "tanso-default-library-textures", name: "Textures" },
  ];

  const handleLibraryChange = (value: string) => {
    setSelectedLibrary(value);
    setRowSelection({});
  };

  useEffect(() => {
    setIsEditable(username === selectedLibrary);
  }, [username, selectedLibrary])

  useEffect(() => {
    if (!isEditable) setShowedColumns(columns.filter(column => column.id !== "select"));
    else setShowedColumns(columns)
  }, [isEditable])

  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <Fragment>
      <LibrarySelector
        selectedLibrary={selectedLibrary}
        onLibraryChange={handleLibraryChange}
        libraries={libraries}
      />
      {isLoading ? (
        <div className="min-h-[10rem] flex items-center justify-center">
          <Loader2 className="animate-spin" stroke="hsl(var(--muted-foreground))" />
        </div>
      ) : (
        !data?.files || isEmpty(data.files) ? (
          <p className="text-white">No files found in this library</p>
        ) : (
          <div className="bg-white p-2 rounded-md">
            <DataTable
              data={data.files}
              columns={showedColumns}
              onSelect={onSelect}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
          </div>
        )
      )}
      <div className="flex items-center justify-between space-x-2 py-4">
        {isEditable && <FileImport />}
        {(data && isEditable) && (
          <Button
            onClick={handleDeleteSelected}
            variant="destructive"
            size="sm"
            className="w-fit"
            disabled={Object.keys(rowSelection).length === 0 || deleteFilesMutation.isPending}
          >
            {deleteFilesMutation.isPending ? 'Deleting...' : 'Delete selection'}
          </Button>
        )}
      </div>
    </Fragment>
  );
}
