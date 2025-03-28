"use client"

import { SelectedPadProvider } from "@/contexts/selected-pad";
import { SoundProvider } from "@/contexts/sound-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";

const queryClient = new QueryClient();

export default function Providers({ children }: PropsWithChildren) {

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <SoundProvider>
          <SelectedPadProvider>
            {children}
          </SelectedPadProvider>
        </SoundProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
