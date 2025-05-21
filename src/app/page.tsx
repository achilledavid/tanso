import { Fragment } from "react";
import style from "./home.module.scss"
import SignInButton from "@/components/sign-in-button";
import Header from "@/components/header/header";
import { AuthButton } from "@/components/auth-button";
import TextReveal from "@/components/text-reveal/text-reveal";

export default function Home() {

  return (
    <Fragment>
      <Header>
        <AuthButton variants={{ size: "sm" }} />
      </Header>
      <main className={style.container}>
        <TextReveal>
          <Fragment>Bring</Fragment>
          <Fragment>your</Fragment>
          <Fragment>music</Fragment>
          <Fragment>to life</Fragment>
        </TextReveal>
        <p>Compose your music with Tanso</p>
        <SignInButton>
          Sign up for free
        </SignInButton>
      </main>
    </Fragment>
  );
}
