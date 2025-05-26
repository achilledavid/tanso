import { Fragment } from "react";
import style from "./home.module.scss"
import Header from "@/components/header/header";
import { AuthButton } from "@/components/auth-button";
import Herobanner from "@/components/landing-page/hero/hero";
import Informations from "@/components/landing-page/informations";
import Product from "@/components/landing-page/product";
import GetStarted from "@/components/landing-page/get-started";
import Workflow from "@/components/landing-page/workflow";
import Footer from "@/components/footer/footer";

export default function Home() {

  return (
    <Fragment>
      <Header>
        <AuthButton variants={{ size: "sm" }} />
      </Header>
      <main className={style.container}>
        <Herobanner />
        <div className="space-y-32 md:space-y-48 mt-32 md:mt-0 pb-32">
          <Informations />
          <Product />
          <Workflow />
          <GetStarted />
        </div>
      </main>
      <Footer />
    </Fragment>
  );
}