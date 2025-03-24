import { Fragment } from "react";
import style from "./home.module.scss"
import SignInButton from "@/components/sign-in-button";
import Header from "@/components/header/header";
import { AuthButton } from "@/components/auth-button";

export default function Home() {

  return (
    <Fragment>
      <Header>
        <AuthButton variants={{ size: "sm" }} />
      </Header>
      <main className={style.container}>
        <h1>
          Bring<br />
          your<br />
          music<br />
          to life
        </h1>
        <p>Compose your music with Tanso</p>
        <SignInButton>
          Sign up for free
        </SignInButton>
      </main>
    </Fragment>
  );
}
