import "./globals.css";
import Providers from "./providers";
import { PropsWithChildren } from "react";
import { Inter } from "next/font/google";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import localFont from 'next/font/local'
import { env } from "process";
import { Metadata } from "next";

const baseUrl = new URL(env.NEXTAUTH_URL || "")

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: {
    default: 'Tanso by Deezer',
    template: '%s | Tanso by Deezer',
  },
  description: 'Bring your music to life. Compose your music with Tanso.',
  openGraph: {
    title: 'Tanso by Deezer',
    description: 'Bring your music to life. Compose your music with Tanso.',
    url: baseUrl,
    siteName: 'Tanso by Deezer',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

const deezer = localFont({
  src: [
    {
      path: './fonts/deezer-bold.woff2',
      weight: '700',
    },
    {
      path: './fonts/deezer-extrabold.woff2',
      weight: '800',
    },
  ],
  variable: "--font-deezer",
})

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${deezer.variable} antialiased min-h-screen flex flex-col`}>
        <Providers>
          <ReactQueryDevtools initialIsOpen={false} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
