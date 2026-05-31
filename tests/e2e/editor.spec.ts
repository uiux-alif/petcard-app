import { test, expect } from "@playwright/test"

test.describe("editor interactions", () => {
  test("scroll over the preview zooms the card", async ({ page }) => {
    await page.goto("/create")
    const readout = page.getByTitle("Reset zoom")
    await expect(readout).toHaveText("100%")

    // Wheel up over the preview panel should increase zoom.
    const preview = page.locator(".pet-card").first()
    const box = await preview.boundingBox()
    if (!box) throw new Error("preview not found")
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.wheel(0, -200)

    await expect(readout).not.toHaveText("100%")
  })

  test("export downloads a non-empty PNG", async ({ page }) => {
    await page.goto("/create")
    // Pick a holo effect so the export has something to freeze.
    await page.getByRole("button", { name: "Rainbow Secret" }).click()

    const downloadPromise = page.waitForEvent("download")
    await page.getByRole("button", { name: /Export PNG/i }).click()
    const download = await downloadPromise

    expect(download.suggestedFilename()).toMatch(/\.png$/)

    // Verify the file is a real, non-trivial PNG (header + meaningful size).
    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const chunk of stream) chunks.push(chunk as Buffer)
    const buf = Buffer.concat(chunks)
    // PNG magic number.
    expect(buf.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a")
    // A 3x card with art should be well over 10KB.
    expect(buf.length).toBeGreaterThan(10_000)
  })
})
