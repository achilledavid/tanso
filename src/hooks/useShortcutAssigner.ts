import { useState, useCallback, useEffect } from "react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export function useShortcutAssigner(defaultShortcut: string, action: () => void, onShortcutChange: (shortcut: string) => void) {
  const { assignShortcut, clearShortcut } = useKeyboardShortcuts();
  const [currentShortcut, setCurrentShortcut] = useState(defaultShortcut);

  const handleAssignShortcut = useCallback(
    (key: string) => {
      clearShortcut(currentShortcut);
      assignShortcut(key, action);
      setCurrentShortcut(key);
      onShortcutChange(key);
    },
    [assignShortcut, clearShortcut, currentShortcut, action, onShortcutChange]
  );

  // Initial assignment
  useEffect(() => {
    assignShortcut(defaultShortcut, action);
  }, [assignShortcut, defaultShortcut, action]);

  return { currentShortcut, handleAssignShortcut };
}