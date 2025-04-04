"use client"

import { Button } from "@/components/ui/button/button";
import { createProject } from "@/lib/project";
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useRouter } from "next/navigation";
import { Switch } from "./ui/switch";

const formSchema = z.object({
  projectName: z.string().min(2, "name must be at least 2 characters longs").max(50, "name must be at most 50 characters long"),
  isPublic: z.boolean().default(false),
})

export default function NewProject({ userId }: { userId: number }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      isPublic: false,
    },
  })

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["my-projects", userId] });
      form.reset();
      router.push(`/projects/${project.uuid}`);
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    createMutation.mutate({
      name: values.projectName,
      isPublic: values.isPublic,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="w-fit">create a new project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>create a new project</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>project name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
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
                    <FormLabel>Make project public</FormLabel>
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
            
            <Button type="submit">create</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
