"use client";

import { Button, buttonVariants } from "@/components/ui/button/button";
import { VariantProps } from "class-variance-authority";
import { signIn } from "next-auth/react";
import { PropsWithChildren } from "react";

export default function SignInButton({
  variants,
  children,
}: PropsWithChildren<{ variants?: VariantProps<typeof buttonVariants> }>) {
  return (
    <Button
      {...variants}
      className="w-fit"
      onClick={() => signIn("google", { callbackUrl: "/account" })}
    >
      {children}
    </Button>
  );
}
