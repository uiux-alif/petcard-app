import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchRandomPokemonCards } from "@/lib/pokeapi/fetch"
import { FloatingTypePills } from "./FloatingTypePills"
import { HeroCardFan } from "./HeroCardFan"

export async function LandingHero() {
  // Three random PokéAPI-backed cards for the hero fan.
  const cards = await fetchRandomPokemonCards(3)

  return (
    <section className="relative flex min-h-[calc(100vh-57px)] flex-col items-center justify-center gap-14 overflow-hidden px-6 py-16 lg:flex-row lg:gap-20 lg:px-10">
      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 25% 40%, rgba(192,132,252,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 75% 60%, rgba(74,222,128,0.1) 0%, transparent 60%)",
        }}
      />
      {/* Floating type emoji pills */}
      <FloatingTypePills />
      {/* Faint dotted grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 75%)",
        }}
      />

      <div className="relative z-10 max-w-xl text-center lg:text-left">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            The collectible card studio for pets
          </span>
        </div>

        <h1 className="font-card-sans text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Turn your pet into a{" "}
          <span className="rainbow-text">legendary</span> trading card
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Upload a photo, pick a type, tune the stats, and add real holographic shine. Fifteen
          templates, nine foil effects, exported as a crisp PNG. Built for the love of good boys,
          floofs, and chaotic little gremlins.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
          <Button asChild size="lg" className="font-bold">
            <Link href="/create">
              Start Creating <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-bold">
            <Link href="/community">Explore Community</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="font-bold">
            <Link href="/card-review">See the effects ✨</Link>
          </Button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 lg:justify-start">
          <Stat value="15" label="Templates" />
          <div className="h-8 w-px bg-border" />
          <Stat value="9" label="Holo effects" />
          <div className="h-8 w-px bg-border" />
          <Stat value="8" label="Card types" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md shrink-0">
        <HeroCardFan initialCards={cards} />
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center lg:text-left">
      <div className="font-card-sans text-2xl font-bold">{value}</div>
      <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  )
}
