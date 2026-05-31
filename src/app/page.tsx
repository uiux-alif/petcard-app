import { fetchPokemonCards } from "@/lib/pokeapi/fetch"
import { LandingHero } from "@/components/landing/LandingHero"
import { LandingShowcase } from "@/components/landing/LandingShowcase"
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks"
import { LandingFeatures } from "@/components/landing/LandingFeatures"
import { LandingCta } from "@/components/landing/LandingCta"
import { LandingFooter } from "@/components/landing/LandingFooter"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  // A handful of community cards (from the PokéAPI feed) for the showcase rail.
  const showcaseCards = await fetchPokemonCards(0, 8)

  return (
    <main className="relative overflow-hidden">
      <LandingHero />
      <LandingShowcase cards={showcaseCards} />
      <LandingHowItWorks />
      <LandingFeatures />
      <LandingCta />
      <LandingFooter />
    </main>
  )
}
