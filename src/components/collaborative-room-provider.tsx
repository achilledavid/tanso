"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useSession } from "next-auth/react";

interface CollaborativeRoomProviderProps {
  children: ReactNode;
  projectUuid: string;
}

export function CollaborativeRoomProvider({
  children,
  projectUuid,
}: CollaborativeRoomProviderProps) {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            Authentication Required
          </h2>
          <p>Please sign in to join the collaborative session.</p>
        </div>
      </div>
    );
  }

  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={`project-${projectUuid}`}
        initialPresence={{
          cursor: null,
          user: {
            id: session.user.id.toString(),
            name: session.user.username || session.user.email || "Anonymous",
            email: session.user.email || "",
            avatar: session.user.avatarUrl || "",
          },
          isPlaying: false,
        }}
      >
        <ClientSideSuspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p>Loading collaborative session...</p>
              </div>
            </div>
          }
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
