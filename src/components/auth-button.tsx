"use client";

import { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "./ui/button/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import SignInButton from "./sign-in-button";

export function AuthButton({
  variants,
}: {
  variants?: VariantProps<typeof buttonVariants>;
}) {
  const session = useSession();

  if (session.status != "authenticated") {
    return (
      <SignInButton variants={variants}>
        Sign in
      </SignInButton>
    );
  } else {
    return (
      <Button {...variants} asChild>
        <Link href="/account/projects">My account</Link>
      </Button>
    );
  }
}
