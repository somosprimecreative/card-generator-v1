import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Pixel · Prime Creative",
  description: "Crie cards e carrosséis organizados com a identidade da sua marca.",
  icons: { icon: "/brand/pixel/app-icon/app-icon-dark-ice.svg", shortcut: "/brand/pixel/app-icon/app-icon-dark-ice.svg" },
  openGraph: { title: "Pixel · Prime Creative", description: "Crie cards e carrosséis organizados com a identidade da sua marca.", siteName: "Pixel · Prime Creative" },
  twitter: { card: "summary", title: "Pixel · Prime Creative", description: "Crie cards e carrosséis organizados com a identidade da sua marca." },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
