"use client"

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
import styles from "./new-project.module.scss";
import { Plus } from "lucide-react";
import LibraryMultiSelect from "@/components/library/library-multiselect";

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

  function handleAddSounds(files: ListBlobResultBlob[]) {
    const newSounds = files.filter(
      file => !selectedSounds.find(s => s.url === file.url)
    );
    const merged = [...selectedSounds, ...newSounds].slice(0, 16);
    setSelectedSounds(merged);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.newProjectForm + " flex flex-col gap-6 text-white"}>
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={styles.labelTitle}>Nom du projet</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="off" className={styles.inputLight} />
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
              <FormLabel className={styles.labelTitle}>Description</FormLabel>
              <FormControl>
                <Textarea {...field} autoComplete="off" className={styles.textareaLight} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <FormLabel className={styles.labelSection}>Sons du projet (jusqu&apos;à 16)</FormLabel>
            <Button
              type="button"
              size="sm"
              onClick={() => setSoundDialogOpen(true)}
              disabled={selectedSounds.length >= 16}
              className={styles.addSoundBtn}
            >
              <Plus size={18} className="mr-1" />
              Ajouter des sons
            </Button>
          </div>
          {selectedSounds.length > 0 && (
            <ul className={styles.soundList}>
              {selectedSounds.map((sound) => (
                <li key={sound.url} className={styles.soundListItem}>
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
            <DialogTitle>Choisir des sons</DialogTitle>
            <LibraryMultiSelect
              username={session.data?.user.username ?? ""}
              selected={selectedSounds}
              onValidate={handleAddSounds}
              maxSelect={16}
            />
          </DialogContent>
        </Dialog>

        <div className={styles.section}>
          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg bg-transparent">
                <div className="space-y-0.5">
                  <FormLabel className={styles.labelSection}>Projet public</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Toute personne ayant le lien pourra accéder à ce projet
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
        </div>

        <div className={styles.section}>
          <FormLabel className={styles.labelSection}>Collaborateurs</FormLabel>
          <div className={"flex items-center gap-2 " + styles.mt2}>
            <Input
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputLight + " flex-1"}
            />
            <Button type="button" size="sm" onClick={addCollaborator}>
              Ajouter
            </Button>
          </div>
          {collaborators.length > 0 && (
            <ul className={styles.collaboratorList}>
              {collaborators.map((collaborator) => (
                <li key={collaborator} className="flex justify-between items-center">
                  <span>{collaborator}</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeCollaborator(collaborator)}
                  >
                    Supprimer
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button type="submit" size="lg" className={styles.btnSubmit}>
          Créer le projet
        </Button>
      </form>
    </Form>
  );
}
