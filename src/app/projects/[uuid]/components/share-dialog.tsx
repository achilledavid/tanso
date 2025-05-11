"use client";

import { Button, buttonVariants } from "@/components/ui/button/button";
import { VariantProps } from "class-variance-authority";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PropsWithChildren } from "react";
import ProjectVisibility from "./visibility";
import CopyLink from "./copy-link";
import { Separator } from "@/components/ui/separator";
import AccessList from "./access-list";

export function ShareProjectDialog({ project, children, variants }: PropsWithChildren<{ variants?: VariantProps<typeof buttonVariants>, project: Project }>) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...variants} className="w-full">
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
        </DialogHeader>
        <div>
          <div className="flex flex-col gap-4">
            <ProjectVisibility project={project} />
            {project?.isPublic && (
              <CopyLink value={`/project/${project.uuid}`} />
            )}
          </div>
          <Separator className="my-4" />
          <AccessList project={project} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
