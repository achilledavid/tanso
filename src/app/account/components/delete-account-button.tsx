"use client"

import { Button, buttonVariants } from "@/components/ui/button/button";
import { deleteUser } from "@/lib/user";
import { VariantProps } from "class-variance-authority";
import { PropsWithChildren } from "react";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";


export function DeleteAccountButton({ variants, children, userId }: PropsWithChildren<{ variants?: VariantProps<typeof buttonVariants>, userId: number }>) {
  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(userId),
    onSuccess: () => {
      signOut({ callbackUrl: "/" });
    }
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...variants} type="button" className="w-fit">
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogClose />
        <DialogTitle>Are you sure you want to leave us&nbsp;?</DialogTitle>
        <p>After this action, there will be no going back. All your data will be lost.</p>
        <div className="flex justify-end gap-4">
          <DialogPrimitive.Close>
            <Button variant="outline" size={"sm"}>Cancel</Button>
          </DialogPrimitive.Close>
          <Button variant="destructive" size={"sm"} onClick={() => deleteMutation.mutate()}>Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
