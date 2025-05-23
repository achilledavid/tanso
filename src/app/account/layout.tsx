"use client"

import Header from "@/components/header/header";
import { Fragment, PropsWithChildren } from "react";
import style from "./account.module.scss";
import { Aside } from "./components/aside";
import { useSession } from "next-auth/react";
import { notFound, redirect } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/user";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AccountLayout({ children }: PropsWithChildren) {
  const session = useSession();
  const userId = session.data?.user.id;

  if (session.status === "unauthenticated") redirect("/login");

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) return null;
      return getUser(userId);
    },
    enabled: !!userId,
  });

  if (!session.data?.user) return null;
  if (!user && !isLoading) notFound();

  return (
    <Fragment>
      <div className={style.wrapper}>
        <Header />
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin" stroke="hsl(var(--muted-foreground))" />
          </div>
        ) : (
          <main className={style.container}>
            <Aside user={user as User} />
            <div>
              {children}
            </div>
          </main>
        )}
      </div>
    </Fragment >
  )
}
