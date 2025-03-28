"use client";

import { Button, buttonVariants } from "@/components/ui/button/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateProject } from "@/lib/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VariantProps } from "class-variance-authority";
import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters long").max(50, "Project name must be at most 50 characters long"),
})

export function UpdateProjectDialog({ variants, children, project, projectUuid }: PropsWithChildren<{ 
  variants?: VariantProps<typeof buttonVariants>, 
  project: Project, 
  projectUuid: string 
}>) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project.name,
    },
  })

  const updateMutation = useMutation({
    mutationFn: (values: { name: string }) => updateProject(projectUuid, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectUuid] });
      setOpen(false);
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button {...variants} className="w-fit">
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Update project name</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
