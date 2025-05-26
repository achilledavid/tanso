"use client";

import { Button, buttonVariants } from "@/components/ui/button/button";
import { VariantProps } from "class-variance-authority";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { PropsWithChildren } from "react";

export default function SignInButton({
  variants,
  children,
}: PropsWithChildren<{ variants?: VariantProps<typeof buttonVariants> }>) {
  const session = useSession();

  if (session.status != "authenticated") {
    return (
      <Button
        {...variants}
        className="w-fit"
        onClick={() => signIn("google", { callbackUrl: "/account/projects" })}
      >
        {children}
      </Button>
    );
  } else {
    return (
      <Button
        {...variants}
        className="w-fit"
        asChild
      >
        <Link href="/account/projects">{children}</Link>
      </Button>
    )
  }
}
