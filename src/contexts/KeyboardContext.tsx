import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { ShortcutAction } from '@/types';

interface KeyboardContextType {
    shortcuts: Record<string, ShortcutAction>;
    assignShortcut: (key: string, action: ShortcutAction) => void;
    clearShortcut: (key: string) => void;
    setStopAction: (action: ShortcutAction) => void;
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(undefined);

export const KeyboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [shortcuts, setShortcuts] = useState<Record<string, ShortcutAction>>({});
    const [stopAction, setStopAction] = useState<ShortcutAction | null>(null);
    const setStopActionCallback = useCallback((action: ShortcutAction) => {
        setStopAction(() => action);
    }, []);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const activeElement = document.activeElement;
            if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
                return;
            }

            if (event.code === "Space") {
                event.preventDefault();
                if (stopAction) {
                    stopAction();
                }
                return;
            }

            const action = shortcuts[event.key];
            if (action) {
                event.preventDefault();
                action();
            }
        },
        [shortcuts, stopAction],
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    const assignShortcut = useCallback(
        (key: string, action: ShortcutAction) => {
            if (key === "Space") return;

            setShortcuts(prev => {
                const updated = { ...prev };

                for (const existingKey in updated) {
                    if (updated[existingKey] === action) {
                        delete updated[existingKey];
                        break;
                    }
                }

                if (updated[key]) {
                    delete updated[key];
                }

                updated[key] = action;
                return updated;
            });
        },
        [],
    );

    const clearShortcut = useCallback((key: string) => {
        setShortcuts(prev => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
        });
    }, []);

    return (
        <KeyboardContext.Provider value={{ 
            shortcuts, 
            assignShortcut, 
            clearShortcut, 
            setStopAction: setStopActionCallback
        }}>
            {children}
        </KeyboardContext.Provider>
    );
};

export const useKeyboardContext = () => {
    const context = useContext(KeyboardContext);
    if (context === undefined) {
        throw new Error('useKeyboardContext must be used within a KeyboardProvider');
    }
    return context;
};