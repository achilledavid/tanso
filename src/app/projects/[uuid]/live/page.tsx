"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPadsFromProject, getProject } from "@/lib/project";
import { Room } from "@/components/room";
import { CollaborativeApp } from "@/components/collaborative-app";
import { notFound } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import Pad from "@/components/pad/pad";
import { isEmpty } from "lodash";
import PopStagger from "@/components/pop-stagger";
import { useUser } from "@/hooks/user";

export default function LiveSession({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const uuid = use(params).uuid;
  const { data: session } = useSession();

  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project", uuid],
    queryFn: () => getProject(uuid),
  });

  const { data: pads, isLoading: isLoadingPads } = useQuery({
    queryKey: ["project-pads", uuid],
    queryFn: () => getPadsFromProject(uuid),
  });

  const { data: creator } = useUser(project?.userId);

  const isLoading = isLoadingPads || isLoadingProject;
  const isCreator = session?.user?.id === project?.userId;

  if (!isLoading && !project) notFound();

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2
          className="animate-spin"
          stroke="hsl(var(--muted-foreground))"
        />
      </div>
    );
  }

  return (
    <Room>
      <CollaborativeApp projectName={project?.name} isCreator={isCreator}>
        <div className="min-h-screen bg-gray-50">
          <main className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center gap-8 pt-20">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-2">{project?.name}</h1>
                <p className="text-gray-600 mb-1">
                  Created by {creator?.username}
                </p>
                <p className="text-gray-500">{project?.description}</p>
              </div>

              <PopStagger className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
                {pads &&
                  !isEmpty(pads) &&
                  pads.map((pad) => (
                    <div
                      key={`pad-${pad.id}`}
                      className={
                        !isCreator ? "pointer-events-none opacity-75" : ""
                      }
                    >
                      <Pad pad={pad} />
                    </div>
                  ))}
              </PopStagger>

              {!isCreator && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center max-w-md">
                  <p className="text-blue-800 text-sm">
                    👀 Vous regardez une session live. Seul le créateur peut
                    interagir avec les pads.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </CollaborativeApp>
    </Room>
  );
}
