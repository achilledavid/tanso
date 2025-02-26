export interface PadInfo {
    id: string;
    sound: string;
    shortcut: string;
}

export interface SoundInfo {
    name: string;
    file: string;
}

export type ShortcutAction = () => void;
