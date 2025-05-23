"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeleteAccountButton } from "./delete-account-button";
import { UpdateInformationsDialog } from "./update-account-dialog";
import SignOutButton from "@/components/sign-out-button";
import { Button } from "@/components/ui/button/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderOpen, Share2, Edit, Trash2, Settings, AudioLines, LogOut, Users, Settings2 } from "lucide-react";
import style from "./aside.module.scss";
import { linkSync } from "fs";
import { Fragment, ReactNode } from "react";

export function Aside({ user }: { user: User }) {
  const pathname = usePathname();

  const links: Array<{ href: string, children: ReactNode }> = [
    {
      href: "/account/projects", children: (
        <Fragment>
          <FolderOpen />
          Projects
        </Fragment>
      )
    },
    {
      href: "/account/library", children: (
        <Fragment>
          <AudioLines />
          Librairies
        </Fragment>
      )
    },
    {
      href: "/account/shared", children: (
        <Fragment>
          <Users />
          Shared with me
        </Fragment>
      )
    },
    {
      href: "/account/preferences", children: (
        <Fragment>
          <Settings2 />
          Preferences
        </Fragment>
      )
    },
  ]

  return (
    <aside className={style.container}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user.avatarUrl} alt={user.username} />
            <AvatarFallback
              style={{
                backgroundColor: `hsl(${((user.email.charCodeAt(0) * 100 + user.email.charCodeAt(1) * 37) % 360)}, 60%, 60%)`
              }}>
              {user.firstname[0]?.toUpperCase()}
              {user.lastname[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <strong className={style.title}>
            {(user.firstname || user.lastname) ? `${user.firstname} ${user.lastname}` : user.username}
          </strong>
        </div>
        <div>
          <UpdateInformationsDialog variants={{ size: "icon", variant: "ghost" }} user={user}>
            <Edit />
          </UpdateInformationsDialog>
        </div>
      </div>
      <div className={style.content}>
        {links.map((link) => (
          <Button
            key={link.href}
            variant={pathname.includes(link.href) ? "primary" : "link"}
            asChild
          >
            <Link href={link.href}>
              {link.children}
            </Link>
          </Button>
        ))}
        <div className={style.footer}>
          <SignOutButton variants={{ variant: "destructive", size: "sm" }}>
            <LogOut />
            Sign out
          </SignOutButton>
        </div>
      </div>
    </aside>
  )
}
