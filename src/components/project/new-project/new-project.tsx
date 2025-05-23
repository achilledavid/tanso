"use client"

import Library from "@/components/library/library";
import { Button } from "@/components/ui/button/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { createProject } from "@/lib/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ListBlobResultBlob } from "@vercel/blob";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  projectName: z.string().min(2, "name must be at least 2 characters long").max(50, "name must be at most 50 characters long"),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  collaborators: z.array(z.string()).optional(),
})

export default function NewProject({ userId }: { userId: number }) {
  const router = useRouter();
  const session = useSession();
  const queryClient = useQueryClient();
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [selectedSounds, setSelectedSounds] = useState<ListBlobResultBlob[]>([]);
  const [soundDialogOpen, setSoundDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      description: "",
      isPublic: false,
      collaborators: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["my-projects", userId] });
      form.reset();
      router.push(`/projects/${project.uuid}`);
    },
  });

  const addCollaborator = () => {
    if (email && !collaborators.includes(email)) {
      setCollaborators([...collaborators, email]);
      setEmail("");
    }
  };

  const removeCollaborator = (emailToRemove: string) => {
    setCollaborators(collaborators.filter((collaborator) => collaborator !== emailToRemove));
  };

  function handleAddSound(file: ListBlobResultBlob) {
    if (selectedSounds.length >= 16) return;
    if (!selectedSounds.find(s => s.url === file.url)) {
      setSelectedSounds([...selectedSounds, file]);
    }
    setSoundDialogOpen(false);
  }

  function handleRemoveSound(url: string) {
    setSelectedSounds(selectedSounds.filter(s => s.url !== url));
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const sounds: { url: string, fileName: string }[] = selectedSounds.map(sound => ({
      url: sound.url,
      fileName: sound.pathname || sound.url,
    }));

    createMutation.mutate({
      name: values.projectName,
      description: values.description ?? "",
      isPublic: values.isPublic,
      collaborators,
      sounds,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 text-white max-w-screen-sm">
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <FormLabel>Sélectionner jusqu&apos;à 16 sons</FormLabel>
          <Button
            type="button"
            size="sm"
            onClick={() => setSoundDialogOpen(true)}
            disabled={selectedSounds.length >= 16}
          >
            Ajouter un son
          </Button>
          {selectedSounds.length > 0 && (
            <ul className="space-y-2 mt-2">
              {selectedSounds.map((sound) => (
                <li key={sound.url} className="flex items-center justify-between">
                  <span className="truncate">{sound.pathname || sound.url}</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveSound(sound.url)}
                  >
                    Supprimer
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Dialog open={soundDialogOpen} onOpenChange={setSoundDialogOpen}>
          <DialogContent>
            <DialogTitle>Choisir un son</DialogTitle>
            <Library
              username={session.data?.user.username ?? ""}
              onSelect={handleAddSound}
            />
          </DialogContent>
        </Dialog>

        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg p-3">
              <div className="space-y-0.5">
                <FormLabel>Make Project Public</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Anyone with the link can access this project
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <FormLabel>Add Collaborators</FormLabel>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="button" size="sm" onClick={addCollaborator}>
              Add
            </Button>
          </div>
          {collaborators.length > 0 && (
            <ul className="space-y-2">
              {collaborators.map((collaborator) => (
                <li key={collaborator} className="flex justify-between items-center">
                  <span>{collaborator}</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeCollaborator(collaborator)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
