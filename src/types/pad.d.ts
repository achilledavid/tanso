type Pad = {
  id: string | number;
  url: string;
  projectId: number;
  projectUuid: string;
  fileName: string;
  isLooped: boolean;
  volume: number;
  reverb: number;
  speed: number;
  keyBinding?: string | null;
}
