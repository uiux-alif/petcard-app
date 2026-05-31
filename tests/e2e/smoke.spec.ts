import { test, expect } from "@playwright/test"

test.describe("public surfaces", () => {
  test("landing page renders hero, showcase and credits", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/legendary/i)
    await expect(page.getByText(/Cards trainers made/i)).toBeVisible()
    await expect(page.getByText(/shoulders of open source/i)).toBeVisible()
    // Credits link out to the open-source projects we use.
    await expect(page.getByText("pokemon-cards-css")).toBeVisible()
  })

  test("navigates from landing to the editor", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: /start creating/i }).first().click()
    await expect(page).toHaveURL(/\/create$/)
    await expect(page.getByText(/Card Builder/i)).toBeVisible()
  })

  test("community feed shows PokéAPI cards", async ({ page }) => {
    await page.goto("/community")
    await expect(page.getByRole("heading", { name: /Community/i })).toBeVisible()
    // The feed is seeded with the original 151 — Bulbasaur is #1.
    await expect(page.getByText("Bulbasaur").first()).toBeVisible()
  })

  test("card review page lists holo effects", async ({ page }) => {
    await page.goto("/card-review")
    await expect(page.getByRole("heading", { name: /Review/i })).toBeVisible()
    await expect(page.getByText("Rainbow Secret")).toBeVisible()
  })

  test("editor lets you change the pet name and reflects it in the preview", async ({ page }) => {
    await page.goto("/create")
    const nameInput = page.getByPlaceholder(/Mochi, Luna, Biscuit/i)
    await nameInput.fill("Sir Barksalot")
    await expect(page.locator(".card-name").first()).toHaveText("Sir Barksalot")
  })
})
