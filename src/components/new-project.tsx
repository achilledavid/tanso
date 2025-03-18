"use client"

import { Button } from "@/components/ui/button";
import { createProject } from "@/lib/project";
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState } from "react";

const formSchema = z.object({
  projectName: z.string().min(2, "name must be at least 2 characters longs").max(50, "name must be at most 50 characters long"),
})

export default function NewProject({ userId }: { userId: number }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
    },
  })

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-projects", userId] });
      form.reset();
      setOpen(false);
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMutation.mutate({
      name: values.projectName
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
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
