"use client"

import { MyProjects } from "@/components/my-projects";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/user";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";

export default function Account() {
  const session = useSession();
  const user = session?.data?.user;

  if (session.status === "unauthenticated") redirect("/sign-in");

  const { data: extendedUser, isLoading } = useUser(user?.id);

  if (isLoading || !user) return <div>loading...</div>;
  if (!extendedUser) notFound();

  return (
    <Fragment>
      <p>you are signed in as {extendedUser.name || extendedUser.username}</p>
      <div className="flex gap-2">
        <Button size="sm" asChild>
          <Link href="/">go to home</Link>
        </Button>
        <Button size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
          sign out
        </Button>
      </div>
      <MyProjects userId={user.id} />
    </Fragment>
  )
}