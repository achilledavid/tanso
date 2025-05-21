"use client"

import SignOutButton from "@/components/sign-out-button";
import { Button } from "@/components/ui/button/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AccountAside() {
  const pathname = usePathname();
  const links = [
    { href: "/account", label: "my informations" },
    { href: "/account/projects", label: "my projects", subPath: "/account/projects/new" },
    { href: "/account/shared", label: "shared with me" },
    { href: "/account/library", label: "my library" },
    { href: "/account/preferences", label: "preferences" },
  ] as Array<{ href: string, label: string, subPath?: string }>;

  return (
    <aside>
      {links.map(({ href, label, subPath }) => (
        <Button
          key={href}
          asChild
          variant={(pathname === href || subPath === pathname) ? "default" : "link"}
        >
          <Link href={href}>
            {label}
          </Link>
        </Button>
      ))}
      <SignOutButton variants={{ variant: "link" }}>
        sign out
      </SignOutButton>
    </aside>
  )
}
