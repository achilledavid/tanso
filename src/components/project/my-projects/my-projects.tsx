"use client";

import { getProjectsByUserId } from "@/lib/user";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { Button } from "@/components/ui/button/button";
import Link from "next/link";
import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import style from "./my-projects.module.scss";

export function MyProjects({ userId }: { userId: number }) {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["my-projects", userId],
    queryFn: () => getProjectsByUserId(userId),
  });

  return (
    <Fragment>
      <div className={style["c-my-projects"]}>
        {isLoading ? (
          <p>loading...</p>
        ) : (
          projects && !isEmpty(projects) ? (
            <ul className={style["c-my-projects__list"]}>
              {projects.map((project) => (
                <li key={`project-${project.id}`} className={style["c-my-projects__listItem"]}>
                  <div className={style["c-my-projects__wrapper"]}>
                    {project.isPublic ? (
                      <span className={style["c-my-projects__public"]}>
                        public
                      </span>
                    ) : (
                      <span className={style["c-my-projects__private"]}>
                        private
                      </span>
                    )}
                    <p className={style["c-my-projects__title"]}>{project.name}</p>
                    <p className={style["c-my-project__desc"]}>{project.description}</p>
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
            <p>no projects found</p>
          )
        )}

        <Button variant={"primary"} size="lg" className="w-fit">
          <Link href="/account/projects/new">
            create a new project
          </Link>
        </Button>
      </div>
    </Fragment>
  );
}
