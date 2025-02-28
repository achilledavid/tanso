"use client"

import { SelectedPadProvider } from "@/contexts/selected-pad";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";

export const queryClient = new QueryClient();

export default function Providers({ children }: PropsWithChildren) {

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <SelectedPadProvider>
          {children}
        </SelectedPadProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}