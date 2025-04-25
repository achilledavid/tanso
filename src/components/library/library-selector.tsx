import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LibrarySelector({ selectedLibrary, onLibraryChange, libraries }: LibrarySelectorProps) {
    return (
        <Select value={selectedLibrary} onValueChange={onLibraryChange}>
            <SelectTrigger>
                <SelectValue placeholder="select a library" />
            </SelectTrigger>
            <SelectContent>
                {libraries.map((lib) => (
                    <SelectItem key={lib.id} value={lib.id}>
                        {lib.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
