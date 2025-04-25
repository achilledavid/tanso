"use client";

import { getSharedProjects } from "@/lib/project";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { Button } from "@/components/ui/button/button";
import Link from "next/link";
import { Fragment } from "react";

export function SharedProjects() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["shared-projects"],
    queryFn: getSharedProjects,
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
                    {project.name} <span className="text-xs text-muted-foreground ml-2">({project.user.username})</span>
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>no shared projects found</p>
        )
      )}
    </Fragment>
  );
}
