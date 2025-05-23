"use client"

import { getProjectsByUserId } from "@/lib/user";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Eye, EyeClosed, FolderX, Loader2, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import style from "./project.module.scss"
import PopStagger from "@/components/pop-stagger";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { isEmpty } from "lodash";
import { Button } from "@/components/ui/button/button";

export default function AccountProjects() {
  const session = useSession();
  const userId = session.data?.user.id;

  if (!userId) notFound();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["my-projects", userId],
    queryFn: () => getProjectsByUserId(userId),
  });

  return (isLoading && !projects) ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="animate-spin" stroke="hsl(var(--muted-foreground))" />
    </div>
  ) : (
    projects && !isEmpty(projects) ? (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className='text-2xl font-semibold text-gray-100 font-["Deezer"] uppercase'>My projects</h1>
          <Button asChild size="sm" className="w-fit">
            <Link href="projects/new">
              Create a project
              <Plus />
            </Link>
          </Button>
        </div>
        <PopStagger className={style.grid}>
          {projects?.map((project) => (
            <li className="h-full group">
              <Link className={style.project} href={`/projects/${project.uuid}`}>
                <div className="flex items-center justify-between gap-2 pr-2">
                  <strong className="font-semibold text-gray-100">
                    {project.name}
                  </strong>
                  {project.isPublic ? <Eye size={14} /> : <EyeClosed size={14} />}
                </div>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                <div className="mt-auto">
                  <div className="flex items-center justify-between mt-4 min-h-8 w-full gap-2">
                    {project.AccessAuthorized && !isEmpty(project.AccessAuthorized) && (
                      <div className="flex gap-2">
                        {project.AccessAuthorized.map((user, index) => (
                          <Avatar key={user.userEmail}>
                            <AvatarFallback
                              className="uppercase"
                              style={{
                                backgroundColor: `hsl(${((user.userEmail.charCodeAt(0) * 100 + user.userEmail.charCodeAt(1) * 37) % 360)}, 60%, 60%)`
                              }}
                            >
                              {user.userEmail[0]}{user.userEmail[1]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    )}
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
          <h2 className='text-2xl font-semibold text-gray-100 font-["Deezer"] uppercase'>No project found</h2>
        </div>
        <p className="text-muted-foreground">
          You haven't created any projects yet.
        </p>
        <p className="text-muted-foreground">
          Get started and create your first project now!
        </p>
        <Button asChild size="sm" className="mt-6">
          <Link href="projects/new">
            Create a project
            <ArrowRight />
          </Link>
        </Button>
      </div>
    )
  )
}
