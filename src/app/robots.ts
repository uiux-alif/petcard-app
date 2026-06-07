import type { MetadataRoute } from "next"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

/**
 * robots.txt — allow public pages, keep auth-gated + utility routes out of
 * the index. Points crawlers at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/settings", "/collection", "/auth/", "/card-review"],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  }
}
