"use client";

import { Button, buttonVariants } from "@/components/ui/button/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateProject } from "@/lib/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters long").max(50, "Project name must be at most 50 characters long"),
})

export function UpdateName({ project }: PropsWithChildren<{
  variants?: VariantProps<typeof buttonVariants>, project: Project
}>) {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project.name,
    },
  })

  const updateMutation = useMutation({
    mutationFn: (values: { name: string }) => updateProject(project.uuid, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', project.uuid] });
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    updateMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm" disabled={updateMutation.isPending} className="w-fit ml-auto">
          {updateMutation.isPending ? <Loader2 className="animate-spin" /> : "Update"}
        </Button>
      </form>
    </Form>
  )
}
