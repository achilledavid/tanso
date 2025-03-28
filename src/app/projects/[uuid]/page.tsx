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
      <main className="flex gap-4 p-4">
        {isLoadingProject ? (
          <p>loading...</p>
        ) : (
          <>
            <div className="flex flex-col gap-2 min-w-[320px]">
              <p className="text-xl font-bold">{project?.name}</p>
              <Button
                size="sm"
                className="w-fit mb-2"
                variant="destructive"
                onClick={handleDelete}
              >
                delete project
              </Button>
              <SelectedPad projectUuid={uuid} />
            </div>
            {isLoadingPads ? (
              <p>loading...</p>
            ) : (
              <div className="grid grid-cols-4 grid-rows-4 gap-4 h-fit">
                {pads &&
                  !isEmpty(pads) &&
                  pads.map((pad) => <Pad key={`pad-${pad.id}`} pad={pad} />)}
              </div>
            )}
          </>
        )}
      </main>
    </Fragment>
  );
}
