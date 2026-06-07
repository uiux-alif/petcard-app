import type { CardData, CardTemplate } from "@/types/card"
import { DEFAULT_TEMPLATE } from "@/lib/card/constants"
import { ClassicTemplate } from "./ClassicTemplate"
import { NeoTemplate } from "./NeoTemplate"
import { MinimalTemplate } from "./MinimalTemplate"
import { RetroTemplate } from "./RetroTemplate"
import { PolaroidTemplate } from "./PolaroidTemplate"
import { StyledTemplate } from "./StyledTemplate"

// Templates that share the StyledTemplate markup, differentiated by CSS.
const STYLED: CardTemplate[] = [
  "aurora", "midnight", "sticker", "blueprint", "vapor",
  "comic", "kraft", "neon", "royal", "terminal",
  "sakura", "carbon", "candy", "frost", "ember", "graffiti",
]

/** Render the inner layout for a card's template (falls back to default). */
export function renderTemplate(card: CardData) {
  const template: CardTemplate = card.template ?? DEFAULT_TEMPLATE

  if (STYLED.includes(template)) return <StyledTemplate card={card} />

  switch (template) {
    case "neo":
      return <NeoTemplate card={card} />
    case "minimal":
      return <MinimalTemplate card={card} />
    case "retro":
      return <RetroTemplate card={card} />
    case "polaroid":
      return <PolaroidTemplate card={card} />
    case "classic":
    default:
      return <ClassicTemplate card={card} />
  }
}

export { ClassicTemplate, NeoTemplate, MinimalTemplate, RetroTemplate, PolaroidTemplate, StyledTemplate }
