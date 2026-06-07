import type { Metadata } from "next"
import Link from "next/link"
import { SITE } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms for using PetCard — a free, non-commercial fan project.",
}

const UPDATED = "June 7, 2026"

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-card-sans text-3xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated {UPDATED}</p>

      <div className="prose-petcard mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">1. The short version</h2>
          <p>
            PetCard is a free, non-commercial hobby project that lets you design collectible
            trading-card-style cards for your pets. There&apos;s no payment, no subscription, and no
            premium tier — everything is free. Be kind, don&apos;t upload anything illegal or
            abusive, and we&apos;ll get along fine.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">2. Your account</h2>
          <p>
            You&apos;re responsible for activity under your account and for keeping your login
            secure. You must be old enough to consent to data processing in your country (generally
            13+). You can delete your account at any time from{" "}
            <Link href="/settings" className="text-primary hover:underline">
              Settings
            </Link>
            , which permanently removes your cards, likes, and profile.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">3. Your content</h2>
          <p>
            You keep ownership of the photos and cards you create. By making a card public, you grant
            PetCard a non-exclusive license to display it within the app (community feed, profiles,
            share pages). Only upload images you have the right to use. Don&apos;t upload content that
            is illegal, hateful, sexually explicit, or infringes someone else&apos;s rights.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">4. Moderation</h2>
          <p>
            Public cards can be reported by other users. We may remove content or suspend accounts
            that violate these terms, at our discretion, to keep the community safe.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">5. Pokémon &amp; trademarks</h2>
          <p>
            PetCard is a non-commercial fan project and is not affiliated with, endorsed by, or
            sponsored by Nintendo, Game Freak, or The Pokémon Company. Pokémon and related names are
            trademarks of their respective owners. Community sample data comes from the PokéAPI.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">6. No warranty</h2>
          <p>
            PetCard is provided &quot;as is,&quot; without warranties of any kind. It&apos;s a free
            project — we do our best to keep it running, but we can&apos;t guarantee uptime or that
            your data won&apos;t ever be lost. Keep your own copies of cards you care about (you can
            export any card as a PNG).
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">7. Changes &amp; contact</h2>
          <p>
            We may update these terms occasionally; material changes will be reflected by the date
            above. Questions? Reach us at{" "}
            <a href={`mailto:${SITE.contactEmail}`} className="text-primary hover:underline">
              {SITE.contactEmail}
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-10 border-t border-border pt-6 text-sm">
        <Link href="/privacy" className="text-primary hover:underline">
          Read our Privacy Policy →
        </Link>
      </div>
    </main>
  )
}
