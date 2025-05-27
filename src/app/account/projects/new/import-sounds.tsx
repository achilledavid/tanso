"use client"

import { DataTable } from "@/components/library/data-table";
import LibrarySelector from "@/components/library/library-selector/library-selector";
import { Button } from "@/components/ui/button/button";
import { getLibraryByFolderName } from "@/lib/library";
import { useQuery } from "@tanstack/react-query";
import { RowSelectionState } from "@tanstack/react-table";
import { ListBlobResultBlob } from "@vercel/blob";
import { isEmpty } from "lodash";
import { CircleX, Loader2 } from "lucide-react";
import { Fragment, useState } from "react";
import { columns } from "./columns";

const MAX_SELECTION = 16;

export default function ImportSounds({ username, onSubmit }: { username: string, onSubmit: (files: ListBlobResultBlob[]) => void }) {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [selectedLibrary, setSelectedLibrary] = useState<string>(username);
    const [showedColumns] = useState(columns);

    const { data, isLoading } = useQuery({
        queryKey: ['library', selectedLibrary],
        queryFn: () => getLibraryByFolderName(selectedLibrary),
    });

    const handleLibraryChange = (value: string) => {
        setSelectedLibrary(value);
        setRowSelection({})
    };

    const handleRowSelection = (updater: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState)) => {
        setRowSelection(prev => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            const selectedKeys = Object.keys(next);
            if (selectedKeys.length > MAX_SELECTION) {
                const limitedSelection = selectedKeys.slice(0, MAX_SELECTION).reduce((acc, key) => {
                    acc[key] = next[key];
                    return acc;
                }, {} as RowSelectionState);
                return limitedSelection;
            }
            return next;
        });
    };

    function handleImport() {
        const selectedFiles = Object.keys(rowSelection).map(
            index => data?.files[parseInt(index)]
        ).filter((file): file is ListBlobResultBlob => file !== undefined);

        if (selectedFiles.length > 0) {
            onSubmit(selectedFiles);
        }
    }

    return (
        <Fragment>
            <div>
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
                        <DataTable
                            data={data.files}
                            columns={showedColumns}
                            rowSelection={rowSelection}
                            setRowSelection={handleRowSelection}
                        />
                    )
                )}
            </div>
            <div className="flex items-end justify-end gap-4">
                {(data && !isEmpty(data.files)) && (
                    <Button
                        onClick={handleImport}
                        size="sm"
                        className="w-fit"
                        disabled={Object.keys(rowSelection).length === 0}
                    >
                        {Object.keys(rowSelection).length === 0 ? "Import sounds" : `Import ${Object.keys(rowSelection).length} sound(s)`}
                    </Button>
                )}
            </div>
        </Fragment>
    )
}