import { User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LibrarySelector({ selectedLibrary, onLibraryChange, username }: LibrarySelectorProps) {

    const libraries = [
        // { id: "tanso-default-library-bass", name: "Bass" },
        { id: "tanso-default-library-claps", name: "Claps" },
        { id: "tanso-default-library-hats", name: "Hats" },
        { id: "tanso-default-library-kicks", name: "Kicks" },
        // { id: "tanso-default-library-one-shots", name: "One shots" },
        // { id: "tanso-default-library-rims", name: "Rims" },
        { id: "tanso-default-library-snares", name: "Snares" },
        { id: "tanso-default-library-textures", name: "Textures" },
    ];
    return (
        <Select value={selectedLibrary} onValueChange={onLibraryChange}>
            <SelectTrigger>
                <SelectValue placeholder="select a library" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={username}>
                    <div className="flex items-center gap-1.5">
                        <User size={16} />
                        My library
                    </div>
                </SelectItem>
                {libraries.map((lib) => (
                    <SelectItem key={lib.id} value={lib.id}>
                        {lib.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
