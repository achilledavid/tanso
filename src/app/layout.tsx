import "./globals.css";
import Providers from "./providers";
import { PropsWithChildren } from "react";
import { Inter } from "next/font/google";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import localFont from 'next/font/local'

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
      <body className={`${inter.className} ${deezer.variable} antialiased`}>
        <Providers>
          <ReactQueryDevtools initialIsOpen={false} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
