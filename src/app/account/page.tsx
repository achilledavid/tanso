"use client"

import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/user";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Account() {
  const session = useSession();
  const user = session?.data?.user as { id: number };

  if (session.status === "unauthenticated") redirect("/sign-in");

  const { data: extendedUser, isLoading } = useUser(user?.id);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-2 w-fit">
      <p>you are signed in as {extendedUser?.username || extendedUser?.name}</p>
      <Button size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
        sign out
      </Button>
    </div>
  )
}