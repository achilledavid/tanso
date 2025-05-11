interface SoundEditProps {
    file: ListBlobResultBlob;
    onSave: (processed: Blob, fileName: string) => void;
    trigger?: React.ReactNode;
}

interface AudioEffects {
  volume: number;
  pitch: number;
  speed: number;
  reversed: boolean;
  echo: {
    enabled: boolean;
    delay: number;
    feedback: number;
  };
}