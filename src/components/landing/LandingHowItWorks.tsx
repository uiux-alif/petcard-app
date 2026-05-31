import { Upload, SlidersHorizontal, Download } from "lucide-react"

const STEPS = [
  {
    icon: Upload,
    title: "Upload a photo",
    body: "Drop in your pet's best angle. JPG, PNG, or WebP — we frame it like a real card.",
  },
  {
    icon: SlidersHorizontal,
    title: "Make it yours",
    body: "Pick a type and template, tune HP, ATK, DEF & SPD, write moves, and crank the holo.",
  },
  {
    icon: Download,
    title: "Save & share",
    body: "Export a high-res PNG, save to your collection, or publish it to the community feed.",
  },
]

export function LandingHowItWorks() {
  return (
    <section className="relative border-t border-border py-20">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
        <div className="mb-12 text-center">
          <p className="rainbow-text mb-2 font-mono text-xs font-semibold uppercase tracking-[0.14em]">
            ✦ Three steps
          </p>
          <h2 className="font-card-sans text-3xl font-bold tracking-tight">
            From snapshot to collectible
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-xl border border-border bg-card/50 p-6 transition-colors hover:border-primary/40"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <step.icon className="h-5 w-5" />
              </div>
              <span className="absolute right-5 top-5 font-card-sans text-3xl font-bold text-muted-foreground/15">
                {i + 1}
              </span>
              <h3 className="mb-1.5 font-card-sans text-lg font-bold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
