"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPadsFromProject, getProjectForLive } from "@/lib/project";
import { Room } from "@/components/room";
import { CollaborativeApp } from "@/components/collaborative-app";
import { notFound } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Radio, Users, Eye, Crown } from "lucide-react";
import Pad from "@/components/pad/pad";
import { isEmpty } from "lodash";
import PopStagger from "@/components/pop-stagger";
import { useUser } from "@/hooks/user";
import style from "../project.module.scss";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { cn } from '@/lib/utils';
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

function LiveSessionContent({
  project,
  pads,
  creator,
  isCreator,
}: {
  uuid: string;
  project: Project;
  pads: Pad[];
  creator: User;
  isCreator: boolean;
}) {
  const others = useOthers();
  const self = useSelf();

  // Seuls les créateurs peuvent jouer les sons via les raccourcis clavier
  useKeyboardShortcuts(isCreator ? pads : []);

  const totalUsers = others.length + (self ? 1 : 0);
  const viewers =
    others.filter((user) => parseInt(user.id) !== project?.userId).length +
    (self && !isCreator ? 1 : 0);

  return (
    <CollaborativeApp
      projectName={project?.name}
      isCreator={isCreator}
      showTopIndicators={false}
    >
      <div className={style.wrapper}>
        <main className={style.container}>
          <div className={style.grid}>
            <aside>
              <div className={style.project}>
                <div>
                  <h1 className={style.title}>{project?.name}</h1>
                  <p>Created by {creator?.username}</p>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {project?.description}
                  </p>
                </div>
              </div>
            </aside>
            <PopStagger className={cn(style.pads, !isCreator ? "pointer-events-none opacity-75" : "")}>
              {pads &&
                !isEmpty(pads) &&
                pads.map((pad) => <Pad key={`pad-${pad.id}`} pad={pad} disabled={!isCreator} />)}
            </PopStagger>

            <aside className={style.rightSidebar}>
              <div className={style.liveInfo}>
                <div className="flex items-center gap-2 mb-4">
                  <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                  <h2 className={style.title}>Live Session</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Total online</span>
                    </div>
                    <span className="font-medium">{totalUsers}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>Viewers</span>
                    </div>
                    <span className="font-medium">{viewers}</span>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <p className="text-sm font-medium">Connected users</p>
                    <div className={`space-y-2 ${style.userList}`}>
                      {self && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                            {self.presence?.user?.name?.[0]?.toUpperCase() || "Y"}
                          </div>
                          <span>{self.presence?.user?.name || "You"}</span>
                          {isCreator && (
                            <Crown className="w-3 h-3 text-yellow-500" />
                          )}
                        </div>
                      )}
                      {others.map(({ connectionId, presence }) => (
                        <div
                          key={connectionId}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                            {presence?.user?.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <span>{presence?.user?.name || "Anonymous"}</span>
                          {parseInt(presence?.user?.id) === project?.userId && (
                            <Crown className="w-3 h-3 text-yellow-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4 text-sm text-muted-foreground">
                    {isCreator ? (
                      <div className="space-y-2">
                        <p className="flex items-center gap-2">
                          🎛️ <span>You are controlling this session</span>
                        </p>
                        <p>Others can watch your performance</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span>Watching live session</span>
                        </p>
                        <p>Only the creator can interact with pads</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </CollaborativeApp>
  );
}

export default function LiveSession({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const uuid = use(params).uuid;
  const { data: session } = useSession();

  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project-live", uuid],
    queryFn: () => getProjectForLive(uuid),
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

  if (!project || !pads || !creator) {
    return null;
  }
  return (
    <Room>
      <LiveSessionContent
        uuid={uuid}
        project={project}
        pads={pads}
        creator={creator}
        isCreator={isCreator}
      />
    </Room>
  );
}
