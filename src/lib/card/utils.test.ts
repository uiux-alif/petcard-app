import { describe, it, expect } from "vitest"
import {
  clamp,
  getWeakness,
  getExportFileName,
  sanitizeMoveCost,
  sanitizeMoveDamage,
  formatCardNumber,
  getTypeConfig,
  getRarityConfig,
} from "./utils"

describe("clamp", () => {
  it("returns the value when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })
  it("clamps below min and above max", () => {
    expect(clamp(-3, 0, 10)).toBe(0)
    expect(clamp(99, 0, 10)).toBe(10)
  })
})

describe("sanitizeMoveCost", () => {
  it("keeps cost within 1–4 and rounds", () => {
    expect(sanitizeMoveCost(0)).toBe(1)
    expect(sanitizeMoveCost(2.6)).toBe(3)
    expect(sanitizeMoveCost(9)).toBe(4)
  })
})

describe("sanitizeMoveDamage", () => {
  it("keeps damage within 0–300 and rounds", () => {
    expect(sanitizeMoveDamage(-10)).toBe(0)
    expect(sanitizeMoveDamage(45.4)).toBe(45)
    expect(sanitizeMoveDamage(9999)).toBe(300)
  })
})

describe("getWeakness", () => {
  it("returns the weakness emoji with ×2 for a type", () => {
    // electric is weak to water (💧) per the type config
    expect(getWeakness("electric")).toBe("💧×2")
  })
})

describe("getExportFileName", () => {
  it("slugifies the name and falls back to petcard", () => {
    expect(getExportFileName("Mochi The Dog")).toBe("mochi-the-dog")
    expect(getExportFileName("")).toBe("petcard")
  })
})

describe("formatCardNumber", () => {
  it("falls back to 001/100 when empty", () => {
    expect(formatCardNumber("")).toBe("001/100")
    expect(formatCardNumber("042/151")).toBe("042/151")
  })
})

describe("config lookups", () => {
  it("returns a type config with expected shape", () => {
    const cfg = getTypeConfig("fire")
    expect(cfg.label).toBe("FIRE")
    expect(cfg.gradient).toContain("gradient")
  })
  it("returns a rarity config for each level", () => {
    expect(getRarityConfig(1).label).toBeDefined()
    expect(getRarityConfig(5).holoClass).toBeTruthy()
  })
})
