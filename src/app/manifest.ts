import type { MetadataRoute } from "next"

/** PWA web app manifest — enables "Add to Home Screen" + install prompts. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PetCard — Collectible Pet Trading Cards",
    short_name: "PetCard",
    description:
      "Design beautiful collectible trading-card-style cards for your pets. Choose types, stats, rarity, moves, and export as PNG.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/App Icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  }
}
