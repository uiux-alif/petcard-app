import type { Metadata } from "next"
import Link from "next/link"
import { SITE } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How PetCard handles your data — kept minimal, never sold.",
}

const UPDATED = "June 7, 2026"

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-card-sans text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated {UPDATED}</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">The short version</h2>
          <p>
            We collect the minimum needed to run PetCard, we never sell your data, and you can delete
            everything at any time. PetCard is free and ad-free.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">What we store</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong className="text-foreground">Account:</strong> your email, a username, and an
              optional bio + avatar. Authentication is handled by Supabase.
            </li>
            <li>
              <strong className="text-foreground">Cards:</strong> the card data you create and any
              pet photos you upload. Public cards are visible to everyone; private cards are visible
              only to you.
            </li>
            <li>
              <strong className="text-foreground">Likes:</strong> which cards you&apos;ve liked.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">What we don&apos;t do</h2>
          <p>
            We don&apos;t sell or rent your data, we don&apos;t run advertising, and we don&apos;t
            track you across other sites. There&apos;s no payment processing because PetCard is free.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Third parties</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong className="text-foreground">Supabase</strong> — database, authentication, and
              image storage.
            </li>
            <li>
              <strong className="text-foreground">Vercel</strong> — hosting and basic request logs.
            </li>
            <li>
              <strong className="text-foreground">PokéAPI</strong> — supplies sample community data;
              we don&apos;t send it any of your personal information.
            </li>
            <li>
              <strong className="text-foreground">Google</strong> — only if you choose &quot;Sign in
              with Google.&quot;
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Your rights</h2>
          <p>
            You can edit your profile and cards any time, and you can permanently delete your account
            and all associated data from{" "}
            <Link href="/settings" className="text-primary hover:underline">
              Settings
            </Link>
            . Deletion is immediate and irreversible.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Contact</h2>
          <p>
            Questions about privacy? Email{" "}
            <a href={`mailto:${SITE.contactEmail}`} className="text-primary hover:underline">
              {SITE.contactEmail}
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-10 border-t border-border pt-6 text-sm">
        <Link href="/terms" className="text-primary hover:underline">
          Read our Terms of Service →
        </Link>
      </div>
    </main>
  )
}
