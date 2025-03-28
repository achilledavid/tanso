"use client"

import SignOutButton from "@/components/sign-out-button";
import { Button } from "@/components/ui/button/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AccountAside() {
  const pathname = usePathname();
  const links = [
    { href: "/account", label: "Informations" },
    { href: "/account/projects", label: "Projects" },
    { href: "/account/library", label: "Library" },
  ] as Array<{ href: string, label: string }>

  return (
    <aside className="grid grid-flow-row gap-2">
      {links.map(({ href, label }) => (
        <Button
          key={href}
          asChild
          size={'sm'}
          variant={pathname === href ? "default" : "outline"}
        >
          <Link href={href}>
            {label}
          </Link>
        </Button>
      ))}
      <SignOutButton variants={{ variant: "secondary", size: "sm" }}>
        sign out
      </SignOutButton>
    </aside>
  )
}
