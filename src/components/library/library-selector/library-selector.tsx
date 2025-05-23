import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import style from "./library-selector.module.scss";

export default function LibrarySelector({ selectedLibrary, onLibraryChange, libraries }: LibrarySelectorProps) {
    return (
        <Select value={selectedLibrary} onValueChange={onLibraryChange}>
            <SelectTrigger className={style["c-library-selector__trigger"]}>
                <SelectValue placeholder="select a library" />
            </SelectTrigger>
            <SelectContent className={style["c-library-selector__content"]}>
                {libraries.map((lib) => (
                    <SelectItem key={lib.id} value={lib.id}>
                        {lib.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
