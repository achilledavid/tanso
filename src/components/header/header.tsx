import { PropsWithChildren } from "react";
import style from "./header.module.scss";
import Link from "next/link";

export default function Header({ children }: PropsWithChildren) {
  return (
    <header className={style.container}>
      <div className={style.content}>
        <Link href="/">tanso</Link>
        <div>
          {children}
        </div>
      </div>
    </header>
  )
}
