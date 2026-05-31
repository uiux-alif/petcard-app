import { Layers, Sparkles, Wind, Users, Image as ImageIcon, Shuffle } from "lucide-react"

const FEATURES = [
  {
    icon: Layers,
    title: "5 card templates",
    body: "Classic, Neo, Minimal, Retro and Polaroid — same fields, totally different vibe.",
  },
  {
    icon: Sparkles,
    title: "9 holographic effects",
    body: "Reverse, rainbow, cosmos, radiant, secret gold and more — real pointer-tracked foil.",
  },
  {
    icon: Wind,
    title: "Living cards",
    body: "Cards gently breathe their shine at rest and light up fully when you hover.",
  },
  {
    icon: ImageIcon,
    title: "High-res PNG export",
    body: "Export a crisp 3× card image, ready to print or post anywhere.",
  },
  {
    icon: Users,
    title: "Community feed",
    body: "Publish your cards and browse a feed seeded with the original 151 from the PokéAPI.",
  },
  {
    icon: Shuffle,
    title: "Surprise me",
    body: "Can't decide? One click randomizes template, foil and strength to spark ideas.",
  },
]

export function LandingFeatures() {
  return (
    <section className="relative border-t border-border py-20">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
        <div className="mb-12 text-center">
          <p className="rainbow-text mb-2 font-mono text-xs font-semibold uppercase tracking-[0.14em]">
            ✦ Everything you need
          </p>
          <h2 className="font-card-sans text-3xl font-bold tracking-tight">
            Built for beautiful cards
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card/50 p-6 transition-colors hover:border-primary/40"
            >
              <f.icon className="mb-3 h-5 w-5 text-primary" />
              <h3 className="mb-1.5 font-card-sans text-base font-bold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
