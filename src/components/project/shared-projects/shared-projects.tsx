"use client";

import { getSharedProjects } from "@/lib/project";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { Button } from "@/components/ui/button/button";
import Link from "next/link";
import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import style from "./shared-projects.module.scss";

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
          <ul className={style["c-shared-projects__list"]}>
            {projects.map((project) => (
              <li key={`project-${project.id}`} className={style["c-shared-projects__listItem"]}>
                <div className={style["c-shared-projects__wrapper"]}>
                  <p>From user : {project.user.username}</p>
                  <p className={style["c-shared-projects__title"]}>{project.name}</p>
                </div>
                <Button variant="secondary" size="sm" asChild>
                  <Link href={`/projects/${project.uuid}`}>
                    Open <ArrowRight size={16} />
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
