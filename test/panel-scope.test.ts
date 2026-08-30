// Runs against the checked-out Panel source, so a Kirby upgrade that moves a
// file or restructures a rule fails here rather than on the page.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import postcss from "postcss";
import { describe, expect, it } from "vitest";
import {
  SCOPE,
  scopeStylesheet,
} from "../layers/kirby-panel/modules/kirby-panel/vite";

describe("scopeStylesheet", () => {
  it.each(["styles/config.css", "styles/reset.css", "styles/utilities.css"])(
    "keeps every selector of %s inside the scope",
    (path) => {
      const selectors = topLevelSelectors(scope(path));

      expect(selectors.filter((s) => !s.includes(SCOPE))).toEqual([]);
    },
  );

  it("inlines the imports Vite would otherwise resolve on its own", () => {
    const css = scope("styles/config.css");

    expect(css).not.toContain("@import");
    // From `config/colors.css`, one level down.
    expect(css).toContain("--color-l-100");
    // From `config/spacing.css`, whose names collide with Tailwind's.
    expect(css).toContain("--spacing-1");
  });

  it("gives the dark rule an `auto` twin that follows the site's color mode", () => {
    const css = scope("styles/config.css");

    expect(css).toContain(`${SCOPE}:has(.k-panel[data-theme="dark"])`);
    expect(css).toContain(`.dark ${SCOPE}:has(.k-panel[data-theme="auto"])`);
  });

  it("drops the declarations that need a document", () => {
    // `View/Panel.vue` styles `html` with the Panel's scrollbar and background.
    const css = scopeSfcStyle("components/View/Panel.vue");

    expect(css).not.toContain("overflow-y");
    expect(css).toContain("--panel-color-back");
  });
});

function scope(path: string) {
  const file = panelFile(path);
  return scopeStylesheet(readFileSync(file, "utf8"), file);
}

/**
 * Collects the selectors a sheet could reach a document with, deliberately
 * without the plugin's own `isTopLevel`: a test that imports the helper it
 * checks can no longer see a bug inside that helper.
 */
function topLevelSelectors(css: string) {
  const selectors: string[] = [];

  postcss.parse(css).walkRules((rule) => {
    if (rule.parent?.type === "rule") return;
    // Keyframe stops are percentages, not selectors that could reach a document.
    if (
      rule.parent?.type === "atrule" &&
      rule.parent.name.endsWith("keyframes")
    )
      return;
    selectors.push(...rule.selectors);
  });

  return selectors;
}

/** Scopes an SFC's `<style>` block, which Vite hands the plugin without the surrounding markup. */
function scopeSfcStyle(path: string) {
  const file = panelFile(path);
  const style = readFileSync(file, "utf8").match(
    /<style>([\s\S]*?)<\/style>/,
  )![1]!;
  return scopeStylesheet(style, file);
}

function panelFile(path: string) {
  return join(
    import.meta.dirname,
    "../layers/kirby-panel/kirby/panel/src",
    path,
  );
}
