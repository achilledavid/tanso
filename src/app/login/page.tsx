"use client";

import { signIn } from "next-auth/react";
import Header from "@/components/header/header";
import styles from "./login.module.scss";
import { Button } from "@/components/ui/button/button";
import Image from "next/image";
import { AuthButton } from "@/components/auth-button";
import { Fragment } from "react";

export default function LoginPage() {
  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/account/projects" });
  };

  return (
    <Fragment>
      <Header>
        <AuthButton variants={{ size: "sm" }} />
      </Header>

      <main className={styles.container}>
        <div className={styles.loginCard}>
          <div className={styles.logoSection}>
            <h1>tanso</h1>
            <p className={styles.tagline}>Your music creation platform</p>
          </div>

          <div className={styles.formSection}>
            <h2>Sign in to continue</h2>

            <Button
              className={styles.googleButton}
              variant="outline"
              onClick={handleGoogleSignIn}
            >
              <Image
                src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                alt="Google logo"
                width={20}
                height={20}
                className={styles.providerIcon}
              />
              Continue with Google
            </Button>
          </div>

          <div className={styles.footer}>
            <p>
              By continuing, you agree to Tanso&apos;s&nbsp;
              <a href="/terms">Terms of Service</a> and&nbsp;
              <a href="/privacy">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </main>
    </Fragment>
  );
}
