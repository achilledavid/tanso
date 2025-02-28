import "./globals.css";
import Providers from "./providers";
import { PropsWithChildren } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <ReactQueryDevtools initialIsOpen={false} />
          <div className="p-4 flex flex-col gap-2">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}