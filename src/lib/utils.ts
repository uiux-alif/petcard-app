import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isSafeRedirect(url: string): boolean {
  if (!url) return false
  if (url.startsWith("/") && !url.startsWith("//")) return true
  try {
    const parsed = new URL(url)
    const allowed = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL
    if (allowed && parsed.host === allowed) return true
  } catch { /* invalid URL — reject */ }
  return false
}
