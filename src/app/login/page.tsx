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
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Tanso</h1>
          <p className={styles.description}>Log in to start creating music</p>
        </div>

        <div className={styles.cardSection}>
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
          <div className={styles.orSection}>
            <hr />
            <p className={styles.orText}>Why Google ?</p>
          </div>
          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <div className={styles.featureStatus}>
                <div className={styles.featureStatusContent}></div>
              </div>
              <div>
                <p className={styles.featureText}>Secure connection</p>
                <p className={styles.featureDesc}>Your data is protected by Google</p>
              </div>
            </li>
            <li className={styles.featureItem}>
              <div className={styles.featureStatus}>
                <div className={styles.featureStatusContent}></div>
              </div>
              <div>
                <p className={styles.featureText}>Instant access</p>
                <p className={styles.featureDesc}>No need to create a new password</p>
              </div>
            </li>
            <li className={styles.featureItem}>
              <div className={styles.featureStatus}>
                <div className={styles.featureStatusContent}></div>
              </div>
              <div>
                <p className={styles.featureText}>Synchronization</p>
                <p className={styles.featureDesc}>Your creations are saved automatically</p>
              </div>
            </li>
          </ul>
        </div>

        <div className={styles.footer}>
          <p>
            By continuing, you agree to Tanso&apos;s&nbsp;
            <a href="/terms">Terms of Service</a> and&nbsp;
            <a href="/privacy">Privacy Policy</a>.
          </p>
        </div>
      </main>
    </Fragment>
  );
}
