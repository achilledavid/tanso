import Header from "@/components/header/header";
import { Fragment, PropsWithChildren } from "react";
import style from "./account.module.scss";
import { AccountAside } from "./aside";

export default function AccountLayout({ children }: PropsWithChildren) {
  return (
    <Fragment>
      <Header />
      <main className={style.container}>
        <AccountAside />
        <div>
          {children}
        </div>
      </main>
    </Fragment>
  )
}
