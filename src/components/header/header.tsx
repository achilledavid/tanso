"use client"

import { Button } from "../ui/button/button";
import style from "./header.module.scss";
import Link from "next/link";

interface HeaderProps {
  children?: React.ReactNode;
  landing?: boolean;
}

export default function Header({ children, landing }: HeaderProps) {
  return (
    <header className={style.container}>
      <div className={style.content}>
        <Link href="/" className={style.logo}>Tanso</Link>
        {landing && (
          <nav>
            <Button size="sm" variant="link" asChild>
              <Link href="#product">Product</Link>
            </Button>
            <Button size="sm" variant="link" asChild>
              <Link href="#pricing">Pricing</Link>
            </Button>
            <Button size="sm" variant="link" asChild>
              <Link href="#community">Community</Link>
            </Button>
          </nav>
        )}
        <div className="flex gap-2 items-center ml-auto">
          {children}
        </div>
      </div>
    </header>
  )
}
