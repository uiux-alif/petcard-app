import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingCta() {
  return (
    <section className="relative border-t border-border py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(192,132,252,0.12) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <h2 className="font-card-sans text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Your pet deserves to be{" "}
          <span className="rainbow-text">collectible</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground">
          It&apos;s free, it&apos;s fun, and it takes about a minute. Go make the first card in your set.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" className="font-bold">
            <Link href="/create">
              Make your first card <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
