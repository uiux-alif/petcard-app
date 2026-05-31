import type { Metadata } from "next"
import { ReviewGrid } from "./review-grid"

export const metadata: Metadata = {
  title: "Card Effects Review",
  description: "Compare every holographic card effect side by side.",
}

export default function CardReviewPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10 lg:px-10">
      <div className="mb-8">
        <h1 className="font-card-sans text-3xl font-bold">
          Card Effects <span className="rainbow-text">Review</span>
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Every holographic effect, side by side. Hover (or drag on touch) over a card to see its
          shine and glare track your pointer. Note the name and code of any effect you like — that&apos;s
          how we&apos;ll wire it into the editor.
        </p>
        <p className="mt-2 text-xs text-muted-foreground/70">
          Effects ported from{" "}
          <a
            href="https://github.com/simeydotme/pokemon-cards-css"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            pokemon-cards-css
          </a>{" "}
          (MIT) by Simon Goellner.
        </p>
      </div>

      <ReviewGrid />
    </div>
  )
}
