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
          <ul className={style.nav}>
            <li>
              <a href="" className={style.link}>
                <span>Features</span>
              </a>
            </li>
            <li>
              <a href="" className={style.link}>
                <span>Pricing</span>
              </a>
            </li>
            <li>
              <a href="" className={style.link}>
                <span>Community</span>
              </a>
            </li>
          </ul>
        )}
        <div className="flex gap-2 items-center">
          {children}
        </div>
      </div>
    </header>
  )
}
