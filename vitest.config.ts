import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The Kirby checkout under `layers/kirby-panel/kirby` ships its own suite,
    // which expects the Panel's environment.
    include: ["test/**/*.test.ts"],
  },
});
