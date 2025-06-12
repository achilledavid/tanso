// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      cursor: { x: number; y: number } | null;
      user: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
      };
      isPlaying: boolean;
      role?: "creator" | "editor" | "viewer";
      // currentPad?: number;
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    // Storage: {
    //   // Empty for now, can be extended later
    // };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        name: string;
        email: string;
        avatar?: string;
        isCreator: boolean;
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: 
    {
      type: "PAD_PLAYED";
      padId: number;
      userId: string;
      userName: string;
    } | {
      type: "SESSION_MESSAGE";
      message: string;
      userId: string;
    };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    // ThreadMetadata: {};

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      projectName: string;
      creatorName: string;
    };
  }
}

export {};
