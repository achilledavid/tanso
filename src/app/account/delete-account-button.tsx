"use client"

import { Button, buttonVariants } from "@/components/ui/button/button";
import { deleteUser } from "@/lib/user";
import { VariantProps } from "class-variance-authority";
import { PropsWithChildren } from "react";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

export function DeleteAccountButton({ variants, children, userId }: PropsWithChildren<{ variants?: VariantProps<typeof buttonVariants>, userId: number }>) {
  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(userId),
    onSuccess: () => {
      signOut({ callbackUrl: "/" });
    }
  });

  return (
    <Button {...variants} className="w-fit" onClick={() => deleteMutation.mutate()}>
      {children}
    </Button>
  )
}
