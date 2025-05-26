"use client"

import style from "./header.module.scss";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return (
    <header className={style.container}>
      <div className={style.content}>
        <Link href="/" className={style.logo}>
          <Image src={"/svg/logo_white.svg"} alt="Logo" width={140} height={32} />
        </Link>
        <div className="flex gap-2 items-center ml-auto">
          {children}
        </div>
      </div>
    </header>
  )
}
