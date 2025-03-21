import Library from "@/components/library/library"

export default function LibraryPage() {

    return (
        <div className="grid grid-flow-row gap-6">
            <h1 className="text-2xl">Library</h1>
            <div className="flex flex-col gap-2 bg-slate-200 p-4 rounded-lg">
                <p>Add files to your libraries</p>
                <Library />
            </div>
        </div>
    )
}