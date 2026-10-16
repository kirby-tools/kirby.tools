import type { HighlighterCore } from "shiki/core";
import { createCssVariablesTheme, createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

export type HighlightLanguage = "html" | "json" | "php";

let highlighter: Promise<HighlighterCore> | undefined;

/** Splits code into lines of tokens colored with `var(--code-*)`, which the host sets. */
export async function highlightCode(code: string, language: HighlightLanguage) {
  highlighter ??= createHighlighterCore({
    themes: [createCssVariablesTheme({ variablePrefix: "--code-" })],
    langs: [
      import("shiki/langs/html.mjs"),
      import("shiki/langs/json.mjs"),
      import("shiki/langs/php.mjs"),
    ],
    engine: createJavaScriptRegexEngine(),
  });

  return (await highlighter).codeToTokens(code, {
    lang: language,
    theme: "css-variables",
  }).tokens;
}
