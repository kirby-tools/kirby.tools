import { readFileSync } from "node:fs";
import { join } from "node:path";
import { colordx } from "@colordx/core";
import { describe, expect, it } from "vitest";
import { resolveThemeColor, THEME_COLORS } from "../shared/constants/theme";

const RAMP_PATTERN =
  /--color-(?<name>[a-z-]+)-500:\s*(?<value>oklch\([^)]+\));/g;

const ramps = readRamps();

// eslint-disable-next-line test/prefer-lowercase-title -- The suite names the record it covers.
describe("THEME_COLORS", () => {
  it("names exactly the ramps main.css declares", () => {
    expect(Object.keys(THEME_COLORS).sort()).toEqual([...ramps.keys()].sort());
  });

  it.each(Object.entries(THEME_COLORS))(
    "carries %s's 500 shade",
    (name, color) => {
      expect(`oklch(${color.l}% ${color.c} ${color.h})`).toBe(ramps.get(name));
    },
  );

  it.each(Object.entries(THEME_COLORS))(
    "carries %s's hex within a channel of its 500 shade",
    (name, color) => {
      const shade = colordx(ramps.get(name)!).toRgb();
      const hex = colordx(color.hex).toRgb();

      for (const channel of ["r", "g", "b"] as const) {
        expect(
          Math.abs(hex[channel] - shade[channel]),
          channel,
        ).toBeLessThanOrEqual(1);
      }
    },
  );
});

describe("resolveThemeColor", () => {
  it("draws a product's landing page in the product's color", () => {
    expect(resolveThemeColor("/copilot")).toBe("orchid");
  });

  it("draws a product's documentation in the product's color", () => {
    expect(resolveThemeColor("/docs/copilot/getting-started")).toBe("orchid");
  });

  it("reads the product from the first segment, not the last", () => {
    expect(resolveThemeColor("/seo-audit/changelog")).toBe("lima");
  });

  it("falls back to the site's color for a product carrying none", () => {
    expect(resolveThemeColor("/live-preview")).toBe("pumpkin");
  });

  it("falls back to the site's color off a product route", () => {
    expect(resolveThemeColor("/blog/kirby-copilot-v25")).toBe("pumpkin");
  });
});

/** Reads the `oklch()` value of every 500 shade in `main.css`, keyed by ramp name. */
function readRamps(): Map<string, string> {
  const css = readFileSync(
    join(import.meta.dirname, "../app/assets/css/main.css"),
    "utf8",
  );

  return new Map(
    [...css.matchAll(RAMP_PATTERN)].map(({ groups }) => [
      groups!.name!,
      groups!.value!,
    ]),
  );
}
