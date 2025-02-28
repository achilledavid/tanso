"use client"

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { redirect } from 'next/navigation'

export default function Login() {
  const session = useSession()

  if (session?.data?.user) redirect('/account')

  return (
    <Button className="w-fit" onClick={() => signIn("google", { callbackUrl: "/account" })}>
      connect with google
    </Button>
  );
}
