import { defineConfig } from "vitest/config";
import path from "node:path";

// Solo domain/application (lógica pura) — infrastructure/ (Supabase) y
// presentation/ (componentes) se siguen verificando con Playwright, no acá.
// Ver docs/architecture/05-estructura-carpetas.md.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
  },
});
