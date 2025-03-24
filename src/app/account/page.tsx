import { MyProjects } from "@/components/my-projects";
import { notFound } from "next/navigation";
import style from "./account.module.scss";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Fragment } from "react";
import Header from "@/components/header/header";
import SignOutButton from "@/components/sign-out-button";
import Library from "@/components/library/library";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeleteAccountButton } from "./delete-account-button";

export default async function Account() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) notFound();

  return (
    <Fragment>
      <Header>
        <SignOutButton variants={{ size: "sm", variant: "outline" }}>
          Sign out
        </SignOutButton>
      </Header>
      <main className={style.container}>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src={user.avatarUrl}
              alt={user.username}
            />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <p>{user.name || user.username}</p>
        </div>
        <DeleteAccountButton variants={{ size: "sm", variant: "destructive" }} userId={user.id}>
          delete account
        </DeleteAccountButton>
        <MyProjects userId={user.id} />
        <Library />
      </main>
    </Fragment>
  )
}
