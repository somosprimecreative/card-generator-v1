import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prisma · Prime Creative",
  description: "Crie cards e carrosséis organizados com a identidade da sua marca.",
  icons: { icon: "/brand/prisma/app-icon/app-icon-blue.svg", shortcut: "/brand/prisma/app-icon/app-icon-blue.svg" },
  openGraph: { title: "Prisma · Prime Creative", description: "Crie cards e carrosséis organizados com a identidade da sua marca.", siteName: "Prisma · Prime Creative" },
  twitter: { card: "summary", title: "Prisma · Prime Creative", description: "Crie cards e carrosséis organizados com a identidade da sua marca." },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
