"use client"

import { useSelectedPad } from "@/contexts/selected-pad";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updatePadKeyBinding } from "@/lib/pad";
import { getPadsFromProject } from "@/lib/project";
import { AlertCircle, Keyboard, Trash2, Edit3 } from "lucide-react";
import style from './key-binding.module.scss';
import { Button } from "@/components/ui/button/button";

export default function KeyBinding({ projectUuid }: { projectUuid: string }) {
  const queryClient = useQueryClient();
  const { selectedPad, selectPad } = useSelectedPad();
  const [listeningForKey, setListeningForKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const keyBindingRef = useRef<HTMLDivElement>(null);

  const { data: pads } = useQuery({
    queryKey: ['project-pads', projectUuid],
    queryFn: () => getPadsFromProject(projectUuid),
  });

  useEffect(() => {
    if (listeningForKey && keyBindingRef.current) {
      keyBindingRef.current.focus();
    }
  }, [listeningForKey]);

  const updateKeyBindingMutation = useMutation({
    mutationFn: async ({ pad, keyBinding }: { pad: Pad, keyBinding: string | null }) => {
      await updatePadKeyBinding(pad, keyBinding, projectUuid);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-pads', projectUuid] }).then(() => {
        selectPad({
          ...selectedPad!,
          keyBinding: variables.keyBinding
        });
      });
    }
  });

  function handleStartKeyBinding() {
    setListeningForKey(true);
    setError(null);
  }

  function handleKeyBindingChange(e: React.KeyboardEvent) {
    if (!selectedPad) return;
    e.preventDefault();

    const key = e.key.toUpperCase();
    if (key === 'ESCAPE') {
      setListeningForKey(false);
      setError(null);
      return;
    }

    const keyAlreadyUsed = pads?.some(pad =>
      pad.id !== selectedPad.id &&
      pad.keyBinding?.toUpperCase() === key
    );

    if (keyAlreadyUsed) {
      setError(`Key "${key}" is already in use`);
      return;
    }

    updateKeyBindingMutation.mutate({
      pad: selectedPad,
      keyBinding: key
    });
    setListeningForKey(false);
    setError(null);
  }

  function handleKeyBindingRemove() {
    if (!selectedPad) return;
    setListeningForKey(false);
    setError(null);
    updateKeyBindingMutation.mutate({
      pad: selectedPad,
      keyBinding: null
    });
  }

  if (!selectedPad) return null;

  return (
    <div className={style.container}>
      <div className={style.label}>Keyboard shortcut</div>
      <div className={style.content}>
        {listeningForKey ? (
          <div
            onKeyDown={handleKeyBindingChange}
            tabIndex={0}
            ref={keyBindingRef}
            className={style.input}
          >
            <Keyboard size={16} />
            <span>Press any key...</span>
          </div>
        ) : (
          <div className={style.shortcut}>
            <div className={style.key}>
              {selectedPad.keyBinding || "No shortcut assigned"}
            </div>
            <div className={style.actions}>
              <Button
                variant="ghost"
                size='icon'
                onClick={handleStartKeyBinding}
                disabled={updateKeyBindingMutation.isPending}
              >
                <Edit3 size={16} />
              </Button>
              {selectedPad.keyBinding && (
                <Button
                  size='icon'
                  variant="ghost"
                  className={style.delete}
                  onClick={handleKeyBindingRemove}
                  disabled={updateKeyBindingMutation.isPending}
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      {error && (
        <div className={style.error}>
          <AlertCircle size={12} />
          {error}
        </div>
      )}
    </div>
  );
}