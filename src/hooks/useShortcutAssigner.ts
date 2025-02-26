import { useCallback, useEffect, useState } from 'react';
import { useKeyboardContext } from '@/contexts/KeyboardContext';
import { DISALLOWED_SHORTCUTS } from '@/config/keyboard';

export function useShortcutAssigner(
    defaultShortcut: string,
    onAction: () => void,
    onShortcutChange: (shortcut: string) => void
) {
    const [currentShortcut, setCurrentShortcut] = useState<string>(defaultShortcut);
    const { assignShortcut, clearShortcut } = useKeyboardContext();

    const handleAssignShortcut = useCallback(
        (key: string) => {
            if (DISALLOWED_SHORTCUTS.includes(key)) return;
            
            clearShortcut(currentShortcut);
            assignShortcut(key, onAction);
            setCurrentShortcut(key);
            onShortcutChange(key);
        },
        [assignShortcut, clearShortcut, currentShortcut, onAction, onShortcutChange]
    );

    useEffect(() => {
        if (defaultShortcut !== currentShortcut && defaultShortcut) {
            clearShortcut(currentShortcut);
            assignShortcut(defaultShortcut, onAction);
            setCurrentShortcut(defaultShortcut);
        }
    }, [defaultShortcut, currentShortcut, assignShortcut, clearShortcut, onAction]);

    return { currentShortcut, handleAssignShortcut };
}