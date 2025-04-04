"use client";

import { Button, buttonVariants } from "@/components/ui/button/button";
import { VariantProps } from "class-variance-authority";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { addProjectAccess, getProjectAccess, removeProjectAccess, setProjectPublic } from "@/lib/project";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

export function ShareProjectDialog({
  projectUuid,
  project,
  children,
  variants,
}: PropsWithChildren<{ 
  variants?: VariantProps<typeof buttonVariants>, 
  project: Project, 
  projectUuid: string 
}>) {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const queryClient = useQueryClient();

  const { data: accessList, isLoading } = useQuery({
    queryKey: ["project-access", projectUuid],
    queryFn: () => getProjectAccess(projectUuid),
    enabled: isOpen,
  });

  const publicMutation = useMutation({
    mutationFn: (isPublic: boolean) => setProjectPublic(projectUuid, isPublic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectUuid] });
    },
  });

  const addAccessMutation = useMutation({
    mutationFn: (email: string) => addProjectAccess(projectUuid, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-access", projectUuid] });
      setEmail("");
    },
  });

  const removeAccessMutation = useMutation({
    mutationFn: (userEmail: string) => removeProjectAccess(projectUuid, userEmail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-access", projectUuid] });
    },
  });

  const handleAddAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      addAccessMutation.mutate(email);
    }
  };

  const handleRemoveAccess = (userEmail: string) => {
    removeAccessMutation.mutate(userEmail);
  };

  const handleTogglePublic = () => {
    const currentIsPublic = typeof project.isPublic === 'boolean' ? project.isPublic : false;
    publicMutation.mutate(!currentIsPublic);
  };

  const copyShareLink = () => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/projects/${projectUuid}`;
    navigator.clipboard.writeText(url);
    setCopyStatus("Copied!");
    setTimeout(() => setCopyStatus(""), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button {...variants} className="w-fit">
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
          <DialogDescription>
            Share your project with others or make it public
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="public-switch">Make project public</Label>
            <Switch
              id="public-switch"
              checked={typeof project.isPublic === 'boolean' ? project.isPublic : false}
              onCheckedChange={handleTogglePublic}
            />
          </div>

          {project?.isPublic && (
            <div className="flex items-center gap-2">
              <Input
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/projects/${projectUuid}`}
                readOnly
                className="flex-1"
              />
              <Button onClick={copyShareLink} size="sm">
                {copyStatus || "Copy"}
              </Button>
            </div>
          )}

          <div className="border-t my-2"></div>

          <form onSubmit={handleAddAccess} className="flex items-center gap-2">
            <Input
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm">Add</Button>
          </form>

          {isLoading ? (
            <div>Loading access list...</div>
          ) : (
            <div className="max-h-[200px] overflow-y-auto">
              {accessList && accessList.length > 0 ? (
                <ul className="space-y-2">
                  {accessList.map((access) => (
                    <li key={access.id} className="flex justify-between items-center">
                      <div>
                        <div>{access.userEmail}</div>
                        {access.user && (
                          <div className="text-sm text-muted-foreground">{access.user.username}</div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveAccess(access.userEmail)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-muted-foreground">No shared access</div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
