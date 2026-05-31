import { CARD_TYPES } from "@/lib/card/constants"

interface Pill {
  emoji: string
  left: string
  top: string
  delay: string
  duration: string
  size: string
}

// Deterministic scatter so SSR/CSR match (no Math.random at render).
const PLACEMENTS = [
  { left: "8%", top: "18%", delay: "0s", duration: "6s", size: "44px" },
  { left: "20%", top: "62%", delay: "1.2s", duration: "7.5s", size: "38px" },
  { left: "34%", top: "30%", delay: "2.1s", duration: "6.8s", size: "34px" },
  { left: "78%", top: "22%", delay: "0.6s", duration: "7s", size: "42px" },
  { left: "88%", top: "58%", delay: "1.8s", duration: "6.4s", size: "36px" },
  { left: "66%", top: "72%", delay: "2.6s", duration: "8s", size: "40px" },
  { left: "52%", top: "12%", delay: "1s", duration: "7.2s", size: "32px" },
  { left: "14%", top: "85%", delay: "3s", duration: "6.6s", size: "38px" },
]

const TYPE_LIST = Object.values(CARD_TYPES) as { emoji: string; label: string }[]

const PILLS: Pill[] = TYPE_LIST.map((t, i) => ({
  emoji: t.emoji,
  ...PLACEMENTS[i % PLACEMENTS.length]!,
}))

/** Ambient emoji "pills" that float gently up and down behind the hero. */
export function FloatingTypePills() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {PILLS.map((pill, i) => (
        <span
          key={i}
          className="float-pill absolute flex items-center justify-center rounded-2xl border border-border bg-card/40 backdrop-blur-sm"
          style={{
            left: pill.left,
            top: pill.top,
            width: pill.size,
            height: pill.size,
            fontSize: `calc(${pill.size} * 0.5)`,
            animationDelay: pill.delay,
            animationDuration: pill.duration,
          }}
        >
          {pill.emoji}
        </span>
      ))}
    </div>
  )
}
