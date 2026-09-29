import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

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
    <html lang="pt-BR" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
