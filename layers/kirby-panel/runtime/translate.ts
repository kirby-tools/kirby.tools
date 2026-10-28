import string from "#kirby-panel/helpers/string";
import translationsJson from "../kirby/i18n/translations/en.json";

const translations: Record<string, string> = {
  ...translationsJson,
  // Keep in sync with each plugin's `src/extensions/translations.php`.
  "johannschopplich.seo-audit.label": "SEO Audit",
  "johannschopplich.seo-audit.analyze": "Analyze",
  "johannschopplich.seo-audit.results": "SEO & Readability Scores",
  "johannschopplich.seo-audit.results.seo": "SEO Scores",
  "johannschopplich.seo-audit.results.readability": "Readability Scores",
  "johannschopplich.seo-audit.issues": "Issues",
  "johannschopplich.seo-audit.rating.good": "Good",
  "johannschopplich.seo-audit.rating.ok": "OK",
  "johannschopplich.seo-audit.rating.bad": "Needs improvement",
  "johannschopplich.seo-audit.rating.feedback": "Feedback",
  "johannschopplich.seo-audit.rating.error": "Errors",
  "johannschopplich.seo-audit.rating.none": "Not available",
  "johannschopplich.seo-audit.category.seo": "SEO",
  "johannschopplich.seo-audit.category.readability": "Readability",
  "johannschopplich.seo-audit.version.changes": "Unsaved changes",
  "johannschopplich.seo-audit.version.latest": "Published version",
  "johannschopplich.seo-audit.rating.stale": "Content changed since",
  "johannschopplich.serp-preview.label": "SERP Preview",
  "johannschopplich.serp-preview.searchConsole": "Google Search Console",
};

/**
 * Resolves a Panel translation key through Kirby's own `template()`, so
 * placeholders like `{ min }` behave as they do in the Panel.
 */
export function translate(
  key: string,
  data?: Record<string, string>,
  fallback?: string,
) {
  if (typeof data === "string") {
    fallback = data;
    data = undefined;
  }

  return string.template(translations[key] ?? fallback ?? key, data);
}
