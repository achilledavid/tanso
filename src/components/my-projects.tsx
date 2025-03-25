"use client";

import { getProjectsByUserId } from "@/lib/user";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { Button } from "@/components/ui/button/button";
import Link from "next/link";
import NewProject from "./new-project";
import { Fragment } from "react";

export function MyProjects({ userId }: { userId: number }) {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["my-projects", userId],
    queryFn: () => getProjectsByUserId(userId),
  });

  return (
    <Fragment>
      {isLoading ? (
        <p>loading...</p>
      ) : (
        projects && !isEmpty(projects) ? (
          <ul className="flex flex-col gap-2">
            {projects.map((project) => (
              <li key={`project-${project.id}`}>
                <Button variant="link" size="sm" asChild>
                  <Link href={`/projects/${project.uuid}`}>
                    {project.name}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>no projects found</p>
        )
      )}
      <NewProject userId={userId} />
    </Fragment>
  );
}
