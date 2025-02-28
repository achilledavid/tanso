import { ListBlobResultBlob } from "@vercel/blob";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { deleteFileFromLibrary } from "@/lib/library";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Howl } from "howler";

export default function File({ file, onSelect }: { file: ListBlobResultBlob, onSelect?: (file: ListBlobResultBlob) => void }) {
  const queryClient = useQueryClient();

  const sound = new Howl({
    src: [file.url],
    volume: 1,
  });

  const handlePlay = () => {
    sound.stop();
    sound.play();
  };

  const deleteMutation = useMutation({
    mutationFn: (fileUrl: string) => deleteFileFromLibrary(fileUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
    }
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="secondary" className="w-full justify-start gap-2">
          {file.pathname}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2">
          {onSelect && <Button onClick={() => onSelect(file)}>Select</Button>}
          <Button onClick={handlePlay}>Play</Button>
          <Button onClick={() => deleteMutation.mutate(file.url)}>Delete</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
