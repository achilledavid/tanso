"use client"

import { MyProjects } from "@/components/my-projects";
import { notFound, redirect } from "next/navigation";
import style from "./account.module.scss";
import { Fragment } from "react";
import Header from "@/components/header/header";
import SignOutButton from "@/components/sign-out-button";
import Library from "@/components/library/library";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeleteAccountButton } from "./delete-account-button";
import { UpdateInformationsDialog } from "./update-account-dialog";
import { getUser } from "@/lib/user";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function Account() {
  const session = useSession();
  const userId = session.data?.user.id;

  if (session.status === "unauthenticated") redirect("/sign-in");

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) return null
      return getUser(userId);
    },
    enabled: !!userId,
  });

  if (!session.data?.user) return null;
  if (!user && !isLoading) notFound();

  return (
    <Fragment>
      <Header>
        <SignOutButton variants={{ size: "sm", variant: "outline" }}>
          Sign out
        </SignOutButton>
      </Header>
      <main className={style.container}>
        {isLoading ? (
          <p>loading...</p>
        ) : user ? (
          <>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={user.avatarUrl}
                  alt={user.username}
                />
                <AvatarFallback>{user.firstname[0].toUpperCase()}{user.lastname[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <p>{(user.firstname && user.lastname) ? `${user.firstname} ${user.lastname}` : user.username}</p>
            </div>
            <div className="flex items-center gap-2">
              <UpdateInformationsDialog variants={{ size: "sm" }} user={user}>
                update informations
              </UpdateInformationsDialog>
              <DeleteAccountButton variants={{ size: "sm", variant: "destructive" }} userId={user.id}>
                delete account
              </DeleteAccountButton>
            </div>
            <MyProjects userId={user.id} />
            <Library />
          </>
        ) : null}
      </main>
    </Fragment>
  )
}
