import { Fragment } from "react";
import style from "./home.module.scss"
import SignInButton from "@/components/sign-in-button";
import Header from "@/components/header/header";
import { AuthButton } from "@/components/auth-button";
import StepCard from "@/components/landing-page/stepCard/StepCard";
import Herobanner from "@/components/landing-page/hero/hero";
import Informations from "@/components/landing-page/informations";
import Product from "@/components/landing-page/product/product";

export default function Home() {

  return (
    <Fragment>
      <Header landing>
        <AuthButton variants={{ size: "sm" }} />
      </Header>

      <main className={style.container}>
        <Herobanner />
        <div className="space-y-32 sm:mt-32 md:mt-0">
          <Informations />
          <Product />

          <section className="w-full bg-gradient-to-r from-[#454545] to-[#1a1a1a] rounded-2xl p-8 md:p-12">
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-[Deezer]">Ready to create your next hit&nbsp;?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of musicians already creating incredible tracks with Tanso
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <SignInButton>Get started for free</SignInButton>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span>Currently in Beta</span>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-[Deezer]">How it works</h2>
              <p className="text-secondary max-w-2xl mx-auto">
                Three simple steps to go from idea to finished piece.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard
                number="01"
                title="Choose Your Sounds"
                description="Browse our extensive library of samples, instruments, and loops to find your perfect sound."
              />
              <StepCard
                number="02"
                title="Create with Pads"
                description="Use our intuitive pad interface to easily compose rhythms, melodies, and complete tracks."
              />
              <StepCard
                number="03"
                title="Refine & Share"
                description="Add effects, mix your track, and share your creation with the world"
              />
            </div>
          </section>
        </div>
      </main>
    </Fragment>
  );
}