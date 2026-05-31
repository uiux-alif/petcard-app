import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    // Vite resolves the "@/*" path alias from tsconfig natively.
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    globals: true,
    // Unit tests only — Playwright e2e lives in tests/e2e and runs separately.
    include: ["src/**/*.test.ts"],
    exclude: ["node_modules", ".next", "tests/e2e/**"],
  },
})
