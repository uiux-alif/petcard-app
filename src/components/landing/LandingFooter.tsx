import Link from "next/link"
import { Star, ExternalLink, Heart } from "lucide-react"
import { DonateButton } from "@/components/layout/DonateButton"

interface Credit {
  name: string
  by: string
  what: string
  href: string
  license: string
}

const CREDITS: Credit[] = [
  {
    name: "pokemon-cards-css",
    by: "Simon Goellner (@simeydotme)",
    what: "The holographic shine & glare technique behind all 9 foil effects.",
    href: "https://github.com/simeydotme/pokemon-cards-css",
    license: "MIT",
  },
  {
    name: "PokéAPI",
    by: "PokéAPI team",
    what: "Powers the community feed — names, types, stats and official artwork.",
    href: "https://pokeapi.co",
    license: "BSD-3",
  },
  {
    name: "pokeapi-js-wrapper",
    by: "Alessandro Pezzé (@Naramsim)",
    what: "Cached browser wrapper we reference for the PokéAPI integration.",
    href: "https://github.com/PokeAPI/pokeapi-js-wrapper",
    license: "MPL-2.0",
  },
  {
    name: "shadcn/ui",
    by: "@shadcn",
    what: "The accessible UI primitives this whole app is assembled from.",
    href: "https://ui.shadcn.com",
    license: "MIT",
  },
]

const STACK = ["Next.js", "React", "Tailwind CSS", "Supabase", "Prisma", "lucide-react"]

export function LandingFooter() {
  return (
    <footer className="relative border-t border-border bg-card/30">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
        {/* Open-source shoutouts */}
        <div className="mb-12">
          <div className="mb-6 flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <h3 className="font-card-sans text-lg font-bold">
              Standing on the shoulders of open source
            </h3>
          </div>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            PetCard wouldn&apos;t exist without these brilliant open-source projects. Huge thanks to
            their authors and communities — go give them a star. 💛
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CREDITS.map((c) => (
              <a
                key={c.name}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-xl border border-border bg-background/50 p-5 transition-colors hover:border-primary/40"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-sm font-bold group-hover:text-primary">
                    {c.name}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <span className="mb-2 text-[11px] text-muted-foreground">{c.by}</span>
                <p className="flex-1 text-xs leading-relaxed text-muted-foreground">{c.what}</p>
                <span className="mt-3 inline-flex w-fit rounded-full border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-muted-foreground">
                  {c.license}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Stack chips */}
        <div className="mb-10 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            Built with
          </span>
          {STACK.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-background/50 px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Free forever + optional support */}
        <div className="mb-12 flex flex-col items-start gap-4 rounded-2xl border border-border bg-background/50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-card-sans text-base font-bold">PetCard is free — forever. 💛</p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              No paywalls, no limits. If it made you smile and you want to help cover hosting,
              a coffee goes a long way. Totally optional.
            </p>
          </div>
          <DonateButton className="shrink-0" />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="rainbow-text font-card-sans text-lg font-bold">PetCard</span>
            <span className="text-xs text-muted-foreground">— made for good pets everywhere</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <Link href="/community" className="hover:text-foreground">
              Community
            </Link>
            <Link href="/create" className="hover:text-foreground">
              Create
            </Link>
            <Link href="/card-review" className="hover:text-foreground">
              Effects
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <a
              href="https://github.com/simeydotme/pokemon-cards-css"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-foreground"
            >
              <Star className="h-4 w-4" /> Credits
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-[11px] text-muted-foreground/60">
          Pokémon and Pokémon character names are trademarks of Nintendo. PetCard is a
          non-commercial fan project and is not affiliated with or endorsed by Nintendo, Game Freak,
          or The Pokémon Company.
        </p>
      </div>
    </footer>
  )
}
