"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

/** Matches Órbita's provider behavior while applying Pixel's own token sets. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <NextThemesProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>{children}</NextThemesProvider>;
}
