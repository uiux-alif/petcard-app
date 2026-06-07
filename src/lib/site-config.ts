/**
 * Site-wide configuration. PetCard is free — we don't bill. If you'd like to
 * support hosting + development, there's an optional "Buy me a coffee" link.
 *
 * Set NEXT_PUBLIC_DONATE_URL to your own donation page (Buy Me a Coffee,
 * Ko-fi, GitHub Sponsors, etc.). When empty, the donation UI is hidden.
 */
export const SITE = {
  name: "PetCard",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  /** Optional donation URL. Empty string hides all donation UI. */
  donateUrl: process.env.NEXT_PUBLIC_DONATE_URL ?? "https://www.buymeacoffee.com/petcard",
  /** Support / contact email surfaced on legal pages. */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@petcard.app",
} as const

/** True when a donation link is configured. */
export function hasDonateUrl(): boolean {
  return SITE.donateUrl.trim().length > 0
}
