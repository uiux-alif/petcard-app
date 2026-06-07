import type { MetadataRoute } from "next"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

/**
 * Sitemap for the public, crawlable surface of the app. Dynamic per-card and
 * per-profile URLs are intentionally omitted here (they're discovered via the
 * community feed) to keep the sitemap stable without a DB round-trip at build.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const routes = ["", "/create", "/community", "/login"]

  return routes.map((path) => ({
    url: `${APP_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/community" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }))
}
