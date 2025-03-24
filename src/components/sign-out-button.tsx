"use client"

import { Button, buttonVariants } from "@/components/ui/button/button";
import { VariantProps } from "class-variance-authority";
import { signOut } from "next-auth/react";
import { PropsWithChildren } from "react";

export default function SignOutButton({ variants, children }: PropsWithChildren<{ variants?: VariantProps<typeof buttonVariants> }>) {

  return (
    <Button {...variants} className="w-fit" onClick={() => signOut({ callbackUrl: "/" })}>
      {children}
    </Button>
  );
}
