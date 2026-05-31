import type { NextConfig } from "next";

// ----------------------------------------------------------------------------
// Security headers profile
// ----------------------------------------------------------------------------
// CSP is intentionally permissive on `connect-src` and `img-src` — Supabase
// + a handful of demo CDNs need to be reachable from the browser. Tighten as
// the deployed image set stabilizes.
//
// `'unsafe-inline'` and `'unsafe-eval'` are required for Next 16 client
// hydration today; revisit when the framework ships nonce-based scripts.
// ----------------------------------------------------------------------------
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in https://images.unsplash.com https://plus.unsplash.com https://picsum.photos https://via.placeholder.com https://placehold.co https://*.googleusercontent.com https://raw.githubusercontent.com https://pokeapi.co",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co https://api.resend.com https://api.midtrans.com https://api.sandbox.midtrans.com https://pokeapi.co https://raw.githubusercontent.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't get confused by the sibling
  // lockfile in the original (Nuxt) project at the repo root.
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },
  async headers() {
    return [
      {
        // Apply the security profile to every page + API route.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
