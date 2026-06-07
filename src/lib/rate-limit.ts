/**
 * Lightweight in-memory rate limiter for server actions.
 *
 * This is a best-effort, per-instance fixed-window limiter — it protects a
 * single serverless/Node instance from rapid abuse (e.g. save/like spam) with
 * zero external dependencies. It is NOT a distributed limiter: on a horizontally
 * scaled deployment each instance keeps its own counters. For hard global
 * guarantees, swap the store for Upstash Redis (same interface). For a free
 * single-instance deployment this is a meaningful first line of defense.
 */

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

// Opportunistic cleanup so the map doesn't grow unbounded over a long uptime.
let lastSweep = 0
function sweep(now: number) {
  if (now - lastSweep < 60_000) return
  lastSweep = now
  for (const [key, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(key)
  }
}

export interface RateLimitResult {
  ok: boolean
  /** Seconds until the window resets (only meaningful when ok === false). */
  retryAfter: number
}

/**
 * Check + consume one token for `key` within a fixed window.
 *
 * @param key      Stable identity (e.g. `save:<userId>`).
 * @param limit    Max actions allowed per window.
 * @param windowMs Window length in milliseconds.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  sweep(now)

  const existing = buckets.get(key)
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfter: 0 }
  }

  if (existing.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) }
  }

  existing.count += 1
  return { ok: true, retryAfter: 0 }
}
