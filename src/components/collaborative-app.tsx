"use client";

import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { Users, Eye } from "lucide-react";

interface CollaborativeAppProps {
  children: React.ReactNode;
  projectName?: string;
  isCreator?: boolean;
  showTopIndicators?: boolean;
}

export function CollaborativeApp({
  children,
  projectName,
  isCreator = false,
  showTopIndicators = true,
}: CollaborativeAppProps) {
  const others = useOthers();
  const self = useSelf();

  const totalUsers = others.length + (self ? 1 : 0);
  const viewers =
    others.filter(() => !isCreator).length +
    (self && !isCreator ? 1 : 0);

  return (
    <div className="relative min-h-screen">
      {showTopIndicators && (
        <>
          {/* Live indicator and viewer count */}
          <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
            {/* Live indicator */}
            <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              LIVE
            </div>

            {/* Viewer count */}
            <div className="flex items-center gap-2 bg-white shadow-lg rounded-full px-3 py-2 text-sm">
              <Eye className="w-4 h-4 text-gray-600" />
              <span className="font-medium">{viewers}</span>
              <span className="text-gray-500">viewers</span>
            </div>

            {/* Total users */}
            <div className="flex items-center gap-2 bg-white shadow-lg rounded-full px-3 py-2 text-sm">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="font-medium">{totalUsers}</span>
              <span className="text-gray-500">online</span>
            </div>
          </div>

          {/* Project title if provided */}
          {projectName && (
            <div className="fixed top-4 left-4 z-50">
              <div className="bg-white shadow-lg rounded-lg px-4 py-2">
                <h1 className="font-semibold text-lg">{projectName}</h1>
                <p className="text-sm text-gray-500">Live Session</p>
              </div>
            </div>
          )}

          {/* User avatars */}
          <div className="fixed top-20 right-4 z-50">
            <div className="flex flex-col gap-2">
              {self && (
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium border-2 border-white shadow-lg">
                    {self.presence?.user?.name?.[0]?.toUpperCase() || "Y"}
                  </div>
                  {isCreator && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-xs">👑</span>
                    </div>
                  )}
                </div>
              )}

              {others.map(({ connectionId, presence }) => (
                <div key={connectionId} className="relative">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-medium border-2 border-white shadow-lg">
                    {presence?.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <div className={showTopIndicators ? "pt-4" : ""}>{children}</div>
    </div>
  );
}
