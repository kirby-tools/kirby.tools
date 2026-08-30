import type { AtRule, Rule } from "postcss";
import type { Plugin } from "vite";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import postcss from "postcss";

export const SCOPE = ".panel-preview";

const KIRBY_ALIAS = /(["'])@\//g;

/**
 * Rewrites the `@/` prefix Kirby's SFCs import their own source with, which in
 * Nuxt points at the site instead.
 *
 * A transform rather than `resolve.alias`, because Vite runs its alias plugin
 * ahead of every `pre` plugin and a `resolveId` hook never sees the prefix. Every
 * `"@/` in the Panel source opens an import path, so a plain swap is enough.
 */
export function kirbyAliasPlugin(srcDir: string): Plugin {
  return {
    name: "kirby-panel:alias",
    enforce: "pre",
    transform(code, id) {
      if (!id.startsWith(srcDir) || !code.includes("@/")) return;
      return { code: code.replaceAll(KIRBY_ALIAS, `$1${srcDir}/`), map: null };
    },
  };
}

function scopeSelector(selector: string) {
  // `:root:has(.k-panel[data-theme="dark"])` carries the dark mode switch, so
  // whatever follows `:root` has to survive.
  if (selector.startsWith(":root")) return SCOPE + selector.slice(5);
  if (selector === "html" || selector === "body") return SCOPE;
  return `${SCOPE} ${selector}`;
}

/** At-rules that wrap ordinary rules, as opposed to keyframes or descriptors. */
const NESTS_RULES = new Set([
  "media",
  "supports",
  "container",
  "layer",
  "scope",
]);

function isTopLevel(rule: Rule) {
  for (let node = rule.parent; node?.type === "atrule"; node = node.parent) {
    if (!NESTS_RULES.has((node as AtRule).name)) return false;
  }
  return rule.parent?.type !== "rule";
}

const PANEL_DARK = '.k-panel[data-theme="dark"]';
const PANEL_AUTO = '.k-panel[data-theme="auto"]';

/**
 * Inlines Kirby's relative `@import`s. Vite resolves them inside its own CSS
 * plugin, reading each file straight off disk, so anything pulled in that way
 * would never reach the scoping below.
 */
function inlineImports(root: postcss.Root, file: string) {
  root.walkAtRules("import", (rule) => {
    // Kirby writes `@import url("./config/colors.css")`, quotes inside `url()`.
    const target = rule.params.match(
      /^(?:url\()?\s*["']([^"']+)["']\s*\)?$/,
    )?.[1];
    if (!target?.startsWith(".")) return;

    const path = resolve(dirname(file), target);
    const nested = postcss.parse(readFileSync(path, "utf8"), { from: path });
    inlineImports(nested, path);
    rule.replaceWith(nested.nodes);
  });
}

/** Declarations that need a document: the container has neither scrollbar nor viewport. */
const DOCUMENT_ONLY = /^(?:overflow(?:-[xy])?|min-height|height|width)$/;

export function scopeStylesheet(css: string, file: string) {
  const root = postcss.parse(css, { from: file });

  inlineImports(root, file);

  root.walkRules((rule) => {
    if (!isTopLevel(rule)) return;

    if (
      rule.selectors.some(
        (selector) => selector === "html" || selector === "body",
      )
    ) {
      rule.walkDecls((decl) => {
        if (DOCUMENT_ONLY.test(decl.prop)) decl.remove();
      });
    }

    rule.selectors = rule.selectors.flatMap((selector) => {
      const scoped = scopeSelector(selector);

      // `auto` follows the site's own `.dark`, resolved in CSS so the mock
      // survives SSR. It extends Kirby's rule rather than restating it, because
      // the switch redefines the whole `--color-l-*` ramp.
      return scoped.includes(PANEL_DARK)
        ? [scoped, `.dark ${scoped.replace(PANEL_DARK, PANEL_AUTO)}`]
        : [scoped];
    });
  });

  return root.toString();
}

/**
 * Prefixes every top-level selector of Kirby's stylesheet with `SCOPE`. The
 * sheet is written for a document Kirby owns: a `*` reset, `body` rules, and
 * `:root` blocks whose `--color-*`, `--spacing-*` and `--text-*` names collide
 * with Tailwind's.
 */
export function kirbyCssPlugin(srcDir: string): Plugin {
  return {
    name: "kirby-panel:css",
    enforce: "pre",
    transform(code, id) {
      const file = id.split("?")[0]!;
      if (!file.startsWith(srcDir)) return;
      if (!/\.css$/.test(file) && !id.includes("type=style")) return;

      return { code: scopeStylesheet(code, file), map: null };
    },
  };
}
