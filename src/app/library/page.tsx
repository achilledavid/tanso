'use client';
import FileImport from "@/components/library/file-import";
import File from "@/components/library/file";
import { ListBlobResultBlob } from "@vercel/blob";
import { getLibrary } from "@/lib/library";
import { useQuery } from "@tanstack/react-query";

export default function LibraryPage({ onSelect }: { onSelect?: (file: ListBlobResultBlob) => void }) {

    const { data, isLoading } = useQuery({
        queryKey: ['library'],
        queryFn: () => getLibrary(),
    });

    if (isLoading || !data) {
        return <p>loading...</p>;
    }

    return (
        <div className="grid grid-flow-row gap-6">
            <h1 className="text-4xl">Library</h1>
            <div className="flex flex-col gap-2 bg-slate-200 p-4 rounded-lg">
                <p>Add files to your libraries</p>
                <FileImport />
            </div>

            <div className="grid grid-flow-row gap-4">
                <h2 className="text-2xl">My libraries</h2>
                <ul className="grid grid-flow-row gap-2">
                    {data.files.map((file) => (
                        <li key={JSON.stringify(file)}>
                            <File file={file} onSelect={onSelect} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}