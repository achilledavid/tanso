"use client";

import { Button } from "@/components/ui/button/button";
import { getUserKeyBinding, updateUserKeyBinding } from "@/lib/preferences";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { Fragment, useEffect, useRef, useState } from "react";

export default function Preferences({ userId }: { userId: number }) {
  const queryClient = useQueryClient();
  const [selectedPad, setSelectedPad] = useState<UserKeyBinding | null>(null);
  const [listeningForKey, setListeningForKey] = useState(false);
  const keyBindingRef = useRef<HTMLDivElement>(null);

  const { data: pads } = useQuery({
    queryKey: ["user-key-binding", userId],
    queryFn: () => getUserKeyBinding(userId),
  });

  useEffect(() => {
    if (listeningForKey && keyBindingRef.current) {
      keyBindingRef.current.focus();
    }
  }, [listeningForKey]);

  const updateKeyBindingMutation = useMutation({
    mutationFn: async ({
      userKeyBinding,
      keyBinding,
    }: {
      userKeyBinding: UserKeyBinding;
      keyBinding: string | null;
    }) => {
      await updateUserKeyBinding(
        userId,
        userKeyBinding.id,
        keyBinding,
        userKeyBinding.padPosition
      );
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["user-key-binding", userId] })
        .then(() => {
            setSelectedPad(null);
        });
    },
  });

  function handleStartKeyBinding(pad: UserKeyBinding) {
    setSelectedPad(pad);
    setListeningForKey(true);
  }

  function handleKeyBindingChange(e: React.KeyboardEvent) {
    if (!selectedPad) return;
    e.preventDefault();

    const key = e.key.toUpperCase();
    if (key === "ESCAPE") {
      setListeningForKey(false);
      setSelectedPad(null);
      return;
    }

    updateKeyBindingMutation.mutate({
      userKeyBinding: selectedPad,
      keyBinding: key,
    });
    setListeningForKey(false);
  }

  return (
    <Fragment>
      <div className="grid grid-cols-4 gap-4 w-full max-w-[550px]">
        {pads &&
          !isEmpty(pads) &&
          [...pads]
            .sort((a, b) => a.padPosition - b.padPosition)
            .map((pad) => (
              <div key={pad.id} className="flex flex-col gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleStartKeyBinding(pad)}
                  onKeyDown={selectedPad?.id === pad.id ? handleKeyBindingChange : undefined}
                  className={cn(
                    "relative w-full aspect-square max-w-[120px] max-h-[120px] flex items-center justify-center text-xl"
                  )}
                >
                  {selectedPad?.id === pad.id && listeningForKey
                    ? "..."
                    : pad.keyBinding?.toUpperCase() || ""}
                </Button>
              </div>
            ))}
      </div>
    </Fragment>
  );
}
