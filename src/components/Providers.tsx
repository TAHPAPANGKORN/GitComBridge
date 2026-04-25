"use client";

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
