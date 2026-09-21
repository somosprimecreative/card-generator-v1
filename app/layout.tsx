import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "prisma.local";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const image = `${protocol}://${host}/og.png`;

  return {
    title: "Prisma · Prime Creative",
    description: "Crie cards e carrosséis organizados com a identidade da sua marca.",
    icons: { icon: "/brand/prisma/app-icon/app-icon-blue.svg", shortcut: "/brand/prisma/app-icon/app-icon-blue.svg" },
    openGraph: { title: "Prisma · Prime Creative", description: "Crie cards e carrosséis organizados com a identidade da sua marca.", images: [{ url: image, width: 1200, height: 630, alt: "Prisma · Prime Creative" }] },
    twitter: { card: "summary_large_image", title: "Prisma · Prime Creative", description: "Crie cards e carrosséis organizados com a identidade da sua marca.", images: [image] },
  };
}

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
