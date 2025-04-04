"use client";

import { Fragment, use } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteProject, getPadsFromProject, getProject } from "@/lib/project";
import { isEmpty } from "lodash";
import Pad from "@/components/pad";
import SelectedPad from "@/components/selected-pad/selected-pad";
import { Button } from "@/components/ui/button/button";
import { notFound, useRouter } from "next/navigation";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import Header from "@/components/header/header";
import { AuthButton } from "@/components/auth-button";
import { UpdateProjectDialog } from "./update-project-dialog";
import { ShareProjectDialog } from "./share-project-dialog";

export default function Project({ params }: { params: Promise<{ uuid: string }> }) {
  const uuid = use(params).uuid;
  const router = useRouter();

  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project", uuid],
    queryFn: () => getProject(uuid),
  });

  const { data: pads, isLoading: isLoadingPads } = useQuery({
    queryKey: ["project-pads", uuid],
    queryFn: () => getPadsFromProject(uuid),
  });

  useKeyboardShortcuts(pads);

  const deleteMutation = useMutation({
    mutationFn: () => deleteProject(uuid),
    onSuccess: () => {
      router.push("/account");
    },
  });

  function handleDelete() {
    deleteMutation.mutate();
  }

  if (!isLoadingProject && !project) notFound();

  return (
    <Fragment>
      <Header>
        <AuthButton variants={{ size: "sm" }} />
      </Header>
      <main className="flex flex-col gap-4 p-4">
        {isLoadingProject ? (
          <p>loading...</p>
        ) : (
          <Fragment>
            <div className="flex gap-4 flex-col-reverse md:flex-row">
              <div className="flex flex-col gap-2 min-w-[320px]">
                <h1 className="text-2xl font-medium">{project?.name}</h1>
                {project?.permissions?.canEdit && (
                  <Fragment>
                    <div className="flex items-center mb-2 gap-2">
                      {project?.permissions?.canRename && (
                        <UpdateProjectDialog 
                          variants={{ size: "sm" }} 
                          project={project as Project}
                          projectUuid={uuid}
                        >
                          Rename
                        </UpdateProjectDialog>
                      )}
                      {project?.permissions?.isOwner && (
                        <ShareProjectDialog
                          variants={{ size: "sm" }}
                          project={project as Project}
                          projectUuid={uuid}
                        >
                          Share
                        </ShareProjectDialog>
                      )}
                      {project?.permissions?.canDelete && (
                        <Button
                          size="sm"
                          className="w-fit"
                          variant="destructive"
                          onClick={handleDelete}
                        >
                          delete project
                        </Button>
                      )}
                      </div>
                      <SelectedPad projectUuid={uuid} />
                    </Fragment>
                  )}
              </div>
              {isLoadingPads ? (
                <p>loading...</p>
              ) : (
                <div className="grid grid-cols-4 gap-4 w-full max-w-[550px]">
                  {pads &&
                    !isEmpty(pads) &&
                    pads.map((pad) => <Pad key={`pad-${pad.id}`} pad={pad} />)}
                </div>
              )}
            </div>
          </Fragment>
        )}
      </main>
    </Fragment>
  );
}
