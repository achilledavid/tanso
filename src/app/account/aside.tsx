"use client"

import SignOutButton from "@/components/sign-out-button";
import { Button } from "@/components/ui/button/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AccountAside() {
  const pathname = usePathname();
  const links = [
    { href: "/account", label: "my informations" },
    { href: "/account/projects", label: "my projects" },
    { href: "/account/shared", label: "shared with me" },
    { href: "/account/library", label: "my library" },
  ] as Array<{ href: string, label: string }>

  return (
    <aside>
      {links.map(({ href, label }) => (
        <Button
          key={href}
          asChild
          variant={pathname === href ? "default" : "link"}
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
