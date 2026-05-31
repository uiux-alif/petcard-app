import { test, expect } from "@playwright/test"

/**
 * Auth-free share flow coverage. The PokéAPI fallback feed always seeds
 * `pokedex-bulbasaur` into /community, /c/[slug], and /s/[slug], so we can drive
 * the public share UX without a logged-in user.
 */
test.describe("public share flow", () => {
  test.use({
    // Some assertions check clipboard contents — give the browser permission.
    permissions: ["clipboard-read", "clipboard-write"],
  })

  test("clicking a community card navigates to the detail page", async ({ page }) => {
    await page.goto("/community")
    await expect(page.getByRole("heading", { name: /Community/i })).toBeVisible()

    // The first 24 PokéAPI cards are deterministic — Bulbasaur (#1) is always there.
    const bulbaLink = page.locator('a[href="/c/pokedex-bulbasaur"]').first()
    await expect(bulbaLink).toBeVisible()
    await bulbaLink.click()

    await expect(page).toHaveURL(/\/c\/pokedex-bulbasaur$/)
    // The detail page H1 is the pet's name (the card itself also renders the
    // name as an inner heading, so we scope to the top-level h1).
    await expect(page.getByRole("heading", { level: 1, name: "Bulbasaur" })).toBeVisible()
  })

  test("detail page exposes a Copy link button and a branded share-page link", async ({
    page,
    context,
  }) => {
    await page.goto("/c/pokedex-bulbasaur")

    // Primary copy-link button (next to the Remix CTA).
    const copyBtn = page.getByRole("button", { name: /Copy link/i })
    await expect(copyBtn).toBeVisible()
    await copyBtn.click()

    // Toast confirms the copy.
    await expect(page.getByText(/Link copied/i)).toBeVisible()

    // The clipboard should now contain the absolute /c/<slug> URL.
    const clip = await page.evaluate(() => navigator.clipboard.readText())
    expect(clip).toMatch(/\/c\/pokedex-bulbasaur$/)

    // Smaller text link points to the branded share page.
    const brandedLink = page.getByRole("link", { name: /shareable card page/i })
    await expect(brandedLink).toHaveAttribute("href", "/s/pokedex-bulbasaur")

    // Sanity check on context permissions (silences unused-var lint without tripping it).
    expect(context).toBeTruthy()
  })

  test("/s/[slug] renders branded share page with proper Share button + CTA", async ({ page }) => {
    await page.goto("/s/pokedex-bulbasaur")

    // The pet's name is the page H1 (scope to level-1 to avoid colliding with
    // the card's inner name heading).
    await expect(page.getByRole("heading", { level: 1, name: "Bulbasaur" })).toBeVisible()

    // Branding block (inside <main>; the navbar also has a rainbow PetCard logo).
    const main = page.getByRole("main")
    await expect(main.getByText(/made with/i)).toBeVisible()
    await expect(main.locator(".rainbow-text", { hasText: "PetCard" })).toBeVisible()

    // Primary share button — first-class button now (was a small ghost copy link before).
    const shareBtn = page.getByRole("button", { name: /share this card/i })
    await expect(shareBtn).toBeVisible()

    // Force the clipboard fallback path: stub navigator.share so the click
    // exercises the same code real desktop browsers without Web Share API hit.
    await page.evaluate(() => {
      Object.defineProperty(navigator, "share", { value: undefined, configurable: true })
    })
    await shareBtn.click()
    await expect(page.getByText(/Link copied/i)).toBeVisible()
    const clip = await page.evaluate(() => navigator.clipboard.readText())
    // The share button shares the canonical /s/<slug> page (this URL).
    expect(clip).toMatch(/\/s\/pokedex-bulbasaur$/)

    // Secondary CTA links to the editor.
    const cta = page.getByRole("link", { name: /Create your own now/i })
    await expect(cta).toHaveAttribute("href", "/create")

    // Detail-page link is present.
    await expect(page.getByRole("link", { name: /View full card details/i })).toHaveAttribute(
      "href",
      "/c/pokedex-bulbasaur",
    )
  })

  test("PokéAPI cards render varied stages (not all BASIC)", async ({ page }) => {
    // Charizard (id 6, total 534) → rarity 4 → always STAGE 2.
    // Each template uses its own stage class; assert by text within the card.
    await page.goto("/c/pokedex-charizard")
    const charCard = page.locator(".pet-card").first()
    await expect(charCard).toBeVisible()
    await expect(charCard.getByText("STAGE 2", { exact: true }).first()).toBeVisible()

    // Mewtwo (id 150, total 680) → rarity 5 → always EX.
    await page.goto("/c/pokedex-mewtwo")
    const mewCard = page.locator(".pet-card").first()
    await expect(mewCard).toBeVisible()
    await expect(mewCard.getByText("EX", { exact: true }).first()).toBeVisible()
  })
})
