"use client";

import { Button, buttonVariants } from "@/components/ui/button/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/lib/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VariantProps } from "class-variance-authority";
import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DeleteAccountButton } from "./delete-account-button";

const formSchema = z.object({
  firstname: z.string().min(2, "Firstname must be at least 2 characters longs").max(50, "Firstname must be at most 50 characters long"),
  lastname: z.string().min(2, "Lastname must be at least 2 characters longs").max(50, "Lastname must be at most 50 characters long"),
})

export function UpdateInformationsDialog({ variants, children, user }: PropsWithChildren<{ variants?: VariantProps<typeof buttonVariants>, user: User }>) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: user,
  })

  const updateMutation = useMutation({
    mutationFn: (values: UpdateUserPayload) => updateUser(user.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', user.id] });
      setOpen(false);
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button {...variants} className="w-fit justify-center items-center">
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Update your informations</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firstname</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lastname</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="ml-auto items-end flex flex-col gap-2">
              <Button type="submit" size="sm" className="w-fit">Update</Button>
              <DeleteAccountButton
                variants={{ size: "sm", variant: "destructive" }}
                userId={user?.id !== undefined ? user.id : 0}
              >
                Delete account
              </DeleteAccountButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
