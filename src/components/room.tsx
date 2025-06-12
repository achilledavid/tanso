"use client";

import { ReactNode } from "react";
import { CollaborativeRoomProvider } from "./collaborative-room-provider";
import { useParams } from "next/navigation";

export function Room({ children }: { children: ReactNode }) {
  const params = useParams();
  const uuid = params?.uuid as string;

  if (!uuid) {
    return <div>Invalid project UUID</div>;
  }

  return (
    <CollaborativeRoomProvider projectUuid={uuid}>
      {children}
    </CollaborativeRoomProvider>
  );
}
