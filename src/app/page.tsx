"use client"
import Link from "next/link";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import AuthNavigation from "@/components/auth-navigation";

export default function Home() {
  const session = useSession();
  const user = session?.data?.user;

  return (
    <div className="flex flex-col gap-2 w-fit">
      <p>welcome to tanso</p>
      <Button size="sm" asChild>
        <Link href="/sessions/2">go to session</Link>
      </Button>
      {user ? <p>you are signed in as {user.name}</p> : <p>you are not signed in</p>}
      <AuthNavigation />
    </div>
  );
}
