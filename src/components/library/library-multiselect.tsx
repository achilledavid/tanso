"use client"

import { DataTable } from "@/components/library/data-table";
import LibrarySelector from "@/components/library/library-selector/library-selector";
import { Button } from "@/components/ui/button/button";
import { getLibraryByFolderName } from "@/lib/library";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { ListBlobResultBlob } from "@vercel/blob";
import { Howl } from "howler";
import { Loader2, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function LibraryMultiSelect({
  username,
  selected,
  onValidate,
  maxSelect = 16,
}: {
  username: string;
  selected: ListBlobResultBlob[];
  onValidate: (files: ListBlobResultBlob[]) => void;
  maxSelect?: number;
}) {
  const [selectedLibrary, setSelectedLibrary] = useState(username);
  const [selectedFiles, setSelectedFiles] = useState<ListBlobResultBlob[]>(selected);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const howlRef = useRef<Howl | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['library', selectedLibrary],
    queryFn: () => getLibraryByFolderName(selectedLibrary),
  });

  useEffect(() => {
    if (!data?.files) return;
    const newSelection: RowSelectionState = {};
    data.files.forEach((file, idx) => {
      if (selectedFiles.some(sel => sel.url === file.url)) {
        newSelection[idx] = true;
      }
    });
    setRowSelection(newSelection);
  }, [selectedLibrary, data?.files, selectedFiles]);

  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
      howlRef.current = null;
    }
    setPlayingUrl(null);
  }, [selectedLibrary]);

  const handleRowSelectionChange: typeof setRowSelection = (updater) => {
    if (!data?.files) return;
    const newRowSelection = typeof updater === "function" ? updater(rowSelection) : updater;
    const selectedInCurrent = Object.keys(newRowSelection)
      .map(idx => data.files[parseInt(idx)])
      .filter(Boolean);

    let newSelectedFiles = [
      ...selectedFiles.filter(
        file => !data.files.some(f => f.url === file.url)
      ),
      ...selectedInCurrent,
    ];

    if (newSelectedFiles.length > maxSelect) {
      newSelectedFiles = newSelectedFiles.slice(0, maxSelect);
    }

    setSelectedFiles(newSelectedFiles);
    setRowSelection(newRowSelection);
  };

  const handlePlay = (file: ListBlobResultBlob) => {
    if (playingUrl === file.url) {
      howlRef.current?.stop();
      howlRef.current?.unload();
      howlRef.current = null;
      setPlayingUrl(null);
    } else {
      howlRef.current?.stop();
      howlRef.current?.unload();
      const howl = new Howl({
        src: file.url,
        volume: 1,
        onend: () => setPlayingUrl(null),
        onstop: () => setPlayingUrl(null),
      });
      howlRef.current = howl;
      howl.play();
      setPlayingUrl(file.url);
    }
  };

  const columns: ColumnDef<ListBlobResultBlob, unknown>[] = useMemo(() => [
    {
      id: "select",
      header: "",
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={!!row.getIsSelected()}
          disabled={
            !row.getIsSelected() && selectedFiles.length >= maxSelect
          }
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      size: 32,
    },
    {
      accessorKey: "pathname",
      header: "Nom",
      cell: ({ row }) => (
        <span className="truncate block max-w-xs">{row.original.pathname || row.original.url}</span>
      ),
    },
    {
      id: "play",
      header: "",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePlay(row.original)}
            aria-label="Play sound"
          >
            <Volume2 />
          </Button>
        );
      },
      size: 32,
    },
  ], [selectedFiles.length, maxSelect, playingUrl]);

  return (
    <div>
      <LibrarySelector
        username={username}
        selectedLibrary={selectedLibrary}
        onLibraryChange={setSelectedLibrary}
      />
      {isLoading ? (
        <div className="min-h-[10rem] flex items-center justify-center">
          <Loader2 className="animate-spin" stroke="hsl(var(--muted-foreground))" />
        </div>
      ) : !data?.files || data.files.length === 0 ? (
        <div className="min-h-[10rem] flex items-center justify-center text-muted-foreground">
          Aucun son trouvé dans cette bibliothèque.
        </div>
      ) : (
        <div className="rounded-md border mt-4">
          <div style={{ maxHeight: 320, overflowY: "auto" }}>
            <DataTable
              columns={columns}
              data={data.files}
              rowSelection={rowSelection}
              setRowSelection={handleRowSelectionChange}
              isDark={true}
              withPagination={false}
            />
          </div>
          <div className="flex justify-end mt-4 px-4 pb-2">
            <Button
              onClick={() => onValidate(selectedFiles)}
              disabled={selectedFiles.length === 0}
            >
              Valider la sélection ({selectedFiles.length}/{maxSelect})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
