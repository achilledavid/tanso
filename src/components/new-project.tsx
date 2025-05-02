"use client"

import { Button } from "@/components/ui/button/button";
import { createProject } from "@/lib/project";
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea"; 
import { Fragment, useState } from "react";

const formSchema = z.object({
  projectName: z.string().min(2, "name must be at least 2 characters long").max(50, "name must be at most 50 characters long"),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  collaborators: z.array(z.string()).optional(),
})

export default function NewProject({ userId }: { userId: number }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [email, setEmail] = useState("");

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMutation.mutate({
      name: values.projectName,
      description: values.description ?? "",
      isPublic: values.isPublic,
      collaborators,
    });
  }

  return (
    <Fragment>
      <h1 className="text-2xl font-bold mb-4">Create a New Project</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

          {/* Collaborators Section */}
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
    </Fragment>
  );
}
