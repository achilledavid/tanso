"use client"

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOut } from "next-auth/react"

export default function AuthNavigation() {
  const session = useSession();

  if (session.status === "authenticated") {
    return (
      <div className="flex gap-2">
        <Button size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
          sign out
        </Button>
        <Button size="sm" asChild>
          <Link href="/account">my account</Link>
        </Button>
      </div>
    )
  }
  else if (session.status === "unauthenticated") {
    return (
      <Button size="sm" className="w-fit" asChild>
        <Link href="/sign-in">sign in</Link>
      </Button>
    )
  }
}