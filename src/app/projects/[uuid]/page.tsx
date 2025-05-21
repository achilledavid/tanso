"use client";

import { Fragment, use } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPadsFromProject, getProject } from "@/lib/project";
import { isEmpty } from "lodash";
import Pad from "@/components/pad/pad";
import SelectedPad from "@/components/selected-pad/selected-pad";
import { notFound } from "next/navigation";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import Header from "@/components/header/header";
import { AuthButton } from "@/components/auth-button";
import { ShareProjectDialog } from "./components/share-dialog";
import PopStagger from "@/components/pop-stagger";
import style from "./project.module.scss";
import { Link, Loader2 } from "lucide-react";
import SettingsDialog from "./components/settings-dialog";
import { useSelectedPad } from "@/contexts/selected-pad";
import { useUser } from "@/hooks/user";

export default function Project({ params }: { params: Promise<{ uuid: string }> }) {
  const uuid = use(params).uuid;
  const { selectedPad } = useSelectedPad();

  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project", uuid],
    queryFn: () => getProject(uuid),
  });

  const { data: pads, isLoading: isLoadingPads } = useQuery({
    queryKey: ["project-pads", uuid],
    queryFn: () => getPadsFromProject(uuid),
  });

  useKeyboardShortcuts(pads);

  const { data: creator } = useUser(project?.userId);

  const isLoading = isLoadingPads || isLoadingProject;

  if (!isLoading && !project) notFound();

  return (
    <div className={style.wrapper}>
      <Header>
        <AuthButton variants={{ size: "sm" }} />
      </Header>
      <main className={style.container}>
        {isLoading || !creator ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin" stroke="hsl(var(--muted-foreground))" />
          </div>
        ) : (
          <Fragment>
            <div className={style.grid}>
              <aside>
                <div className={style.project}>
                  <div>
                    <h1 className={style.title}>{project?.name}</h1>
                    <p>Created by {creator.username}</p>
                  </div>
                  {project?.permissions?.isOwner && (
                    <div className="mt-auto flex gap-3 items-center">
                      <SettingsDialog project={project} />
                      <ShareProjectDialog variants={{ size: "sm" }} project={project}>
                        <Link />
                        Share
                      </ShareProjectDialog>
                    </div>
                  )}
                </div>
                {(project?.permissions?.isOwner && selectedPad) && (
                  <div className={style.pad}>
                    <p className={style.title}>Selected pad</p>
                    <SelectedPad projectUuid={uuid} />
                  </div>
                )}
              </aside>
              <PopStagger className={style.pads}>
                {pads &&
                  !isEmpty(pads) &&
                  pads.map((pad) => <Pad key={`pad-${pad.id}`} pad={pad} />)}
              </PopStagger>
            </div>
          </Fragment>
        )}
      </main>
    </div>
  );
}
