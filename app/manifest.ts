import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Prisma · Prime Creative",
    short_name: "Prisma",
    description: "Geração orientada de cards e carrosséis.",
    start_url: "/",
    display: "standalone",
    background_color: "#EDECE6",
    theme_color: "#2650F6",
    icons: [{ src: "/brand/prisma/app-icon/app-icon-blue.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
