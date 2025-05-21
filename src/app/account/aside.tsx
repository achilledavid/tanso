"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeleteAccountButton } from "./delete-account-button";
import { UpdateInformationsDialog } from "./update-account-dialog";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/user";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import SignOutButton from "@/components/sign-out-button";
import { Button } from "@/components/ui/button/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderOpen, Share2, LibraryBig, Cog, Edit, Trash2 } from "lucide-react";
import style from "./aside.module.scss";

export function AccountAside() {
  const pathname = usePathname();
  const session = useSession();
  const userId = session.data?.user.id;
  const links = [
    { href: "/account/projects", label: "Projects", icon: <FolderOpen /> },
    { href: "/account/shared", label: "Project shared", icon: <Share2 /> },
    { href: "/account/library", label: "Library", icon: <LibraryBig /> },
    { href: "/account/preferences", label: "Preferences", icon: <Cog /> },
  ] as Array<{ href: string, label: string, icon?: React.ReactNode }>;

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
    <aside className={style["c-aside"]}>
      <div className={style["c-aside__header"]}>
        <div className={style["c-aside__headerUser"]}>
          <Avatar>
            <AvatarImage src={user?.avatarUrl} alt={user?.username}/>
            <AvatarFallback>
              {user?.firstname[0]?.toUpperCase()}
              {user?.lastname[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p>
            {user?.firstname && user?.lastname
              ? `${user?.firstname} ${user?.lastname}`
              : user?.username}
          </p>
        </div>
        <div className={style["c-aside__headerActions"]}>
          {user && (
            <>
              <UpdateInformationsDialog variants={{ size: "icon" }} user={user}>
                <Edit />
              </UpdateInformationsDialog>
              <DeleteAccountButton
                variants={{ size: "icon", variant: "destructive" }}
                userId={user?.id !== undefined ? user.id : 0}
              >
                <Trash2 />
              </DeleteAccountButton>
            </>
          )}
        </div>
      </div>
      <div className={style["c-aside__linksList"]}>
        {links.map(({ href, label, icon }) => (
          <Button
            key={href}
            asChild
            variant={pathname === href ? "secondary" : "aside"}
            size="asideSize"
          >
            <Link href={href}>
              {icon}
              {label}
            </Link>
          </Button>
        ))}
      </div>
      <SignOutButton variants={{ variant: "destructive", size: "asideSize" }}>
        Sign out
      </SignOutButton>
    </aside>
  )
}
