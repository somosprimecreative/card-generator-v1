import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pixel · Prime Creative",
    short_name: "Pixel",
    description: "Geração orientada de cards e carrosséis.",
    start_url: "/",
    display: "standalone",
    background_color: "#F1F0EB",
    theme_color: "#F04B3E",
    icons: [{ src: "/brand/pixel/app-icon/app-icon-dark-ice.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
