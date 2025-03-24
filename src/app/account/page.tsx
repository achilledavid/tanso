import { MyProjects } from "@/components/my-projects";
import { Button } from "@/components/ui/button/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import style from "./account.module.scss";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Fragment } from "react";
import Header from "@/components/header/header";
import SignOutButton from "@/components/sign-out-button";
import Library from "@/components/library/library";

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
        <p>you are signed in as {user.name || user.username}</p>
        <MyProjects userId={user.id} />
        <Library />
      </main>
    </Fragment>
  )
}
