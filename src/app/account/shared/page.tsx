"use client"

import PopStagger from "@/components/pop-stagger";
import { getSharedProjects } from "@/lib/project";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { ArrowRight, FolderX, Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import style from "./shared.module.scss"
import { useSession } from "next-auth/react";

export default function AccountSharedProjectsPage() {
  const session = useSession();
  const userId = session?.data?.user.id;

  const { data: projects, isLoading } = useQuery({
    queryKey: ["shared-projects"],
    queryFn: getSharedProjects,
  });

  if (!userId) notFound();

  return (isLoading && !projects) ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="animate-spin" stroke="hsl(var(--muted-foreground))" />
    </div>
  ) : (
    projects && !isEmpty(projects) ? (
      <div className="flex flex-col gap-4">
        <h1 className='text-2xl font-semibold text-gray-100 font-["Deezer"] uppercase'>Shared with me</h1>
        <PopStagger className={style.grid}>
          {projects?.map((project) => (
            <li className="h-full group" key={project.uuid}>
              <Link className={style.project} href={`/projects/${project.uuid}`}>
                <strong className="font-semibold text-gray-100">
                  {project.name}
                </strong>
                <p className="mt-1 text-sm text-muted-foreground">Created by {(project.user.firstname || project.user.lastname) ? `${project.user.firstname} ${project.user.lastname}` : project.user.username}</p>
                <div className="mt-auto">
                  <div className="flex items-center justify-between mt-4 min-h-8 w-full gap-2">
                    <ArrowRight className="w-4 h-4 translate-y-3 opacity-0 group-hover:opacity-100 duration-100 ease-in group-hover:translate-y-2 ml-auto" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </PopStagger>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="flex gap-2 flex-col items-center">
          <FolderX className="w-8 h-8" />
          <h2 className='text-2xl font-semibold text-gray-100 font-["Deezer"] uppercase'>Nothing shared with you</h2>
        </div>
        <p className="text-muted-foreground">
          Unfortunately, no projects have been shared with you yet.
        </p>
      </div>
    )
  )
}
