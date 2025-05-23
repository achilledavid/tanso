"use client";

import { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "./ui/button/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function AuthButton({
  variants,
}: {
  variants?: VariantProps<typeof buttonVariants>;
}) {
  const session = useSession();

  if (session.status != "authenticated") {
    return (
      <Button {...variants} asChild>
        <Link href="/login">Sign in</Link>
      </Button>
    );
  } else {
    return (
      <Button {...variants} asChild>
        <Link href="/account/projects">My account</Link>
      </Button>
    );
  }
}
