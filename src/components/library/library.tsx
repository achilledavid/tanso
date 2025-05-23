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
import { CircleX, Loader2 } from "lucide-react";

export default function Library({ username, onSelect, isDark = false }: { username: string, onSelect?: (file: ListBlobResultBlob) => void, isDark?: boolean }) {
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
      <div className={`${isDark && "dark"}`}>
        <LibrarySelector
          username={username}
          selectedLibrary={selectedLibrary}
          onLibraryChange={handleLibraryChange}
        />
      </div>
      <div>
        {isLoading ? (
          <div className="min-h-[10rem] flex items-center justify-center">
            <Loader2 className="animate-spin" stroke="hsl(var(--muted-foreground))" />
          </div>
        ) : (
          !data?.files || isEmpty(data.files) ? (
            <div className="min-h-[10rem] flex items-center justify-center">
              <div className="flex gap-1 items-center text-muted-foreground">
                <CircleX size={16} />
                <p className="text-sm">No files found</p>
              </div>
            </div>
          ) : (
            <div className={`${isDark && "dark"}`}>
              <DataTable
                isDark={isDark}
                data={data.files}
                columns={showedColumns}
                onSelect={onSelect}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
              />
            </div>
          )
        )}
      </div>
      <div className="flex items-end justify-between gap-4">
        <div className={`${isDark && "dark"}`}>
          {isEditable && <FileImport />}
        </div>
        {(data && !isEmpty(data.files) && isEditable) && (
          <Button
            onClick={handleDeleteSelected}
            variant="destructive"
            size="sm"
            className="w-fit"
            disabled={Object.keys(rowSelection).length === 0 || deleteFilesMutation.isPending}
          >
            {deleteFilesMutation.isPending && <Loader2 className="animate-spin" />}
            Delete selection
          </Button>
        )}
      </div>
    </Fragment>
  );
}
