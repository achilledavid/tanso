"use client";

import { use } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteProject, getPadsFromProject, getProject } from "@/lib/project";
import { isEmpty } from "lodash";
import Pad from "@/components/pad";
import SelectedPad from "@/components/selected-pad/selected-pad";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

export default function Project({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
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

  if (isLoadingProject) return <div>loading...</div>;
  else if (!project) notFound();

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-2 min-w-[320px]">
        <Button size="sm" className="w-fit" asChild>
          <Link href="/">go to home</Link>
        </Button>
        <Button
          size="sm"
          className="w-fit"
          variant="destructive"
          onClick={handleDelete}
        >
          delete project
        </Button>
        <p>{project.name}</p>
        <SelectedPad projectId={uuid} />
      </div>
      {isLoadingPads ? (
        <p>loading...</p>
      ) : (
        <div className="grid grid-cols-4 gap-4 h-fit">
          {pads &&
            !isEmpty(pads) &&
            pads.map((pad) => <Pad key={`pad-${pad.id}`} pad={pad} />)}
        </div>
      )}
    </div>
  );
}
