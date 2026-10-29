import string from "#kirby-panel/helpers/string";
import { translations as copilotTranslations } from "#kirby-plugin/copilot";
import translationsJson from "../kirby/i18n/translations/en.json";

const translations: Record<string, string> = {
  ...translationsJson,
  ...copilotTranslations,
  // Keep in sync with each plugin's `src/extensions/translations.php`.
  "johannschopplich.content-translator.label": "Content Translator",
  "johannschopplich.content-translator.import": "Import",
  "johannschopplich.content-translator.importFrom": "Import from {language}",
  "johannschopplich.content-translator.translate": "Translate → {language}",
  "johannschopplich.content-translator.translateTo": "Translate to",
  "johannschopplich.content-translator.batchTranslate":
    "{language} → All Languages",
  "johannschopplich.content-translator.viewButton.label": "Translator",
  "johannschopplich.content-translator.strategy.deepl": "DeepL",
  "johannschopplich.content-translator.provider.openai": "ChatGPT",
  "johannschopplich.content-translator.help.defaultLanguageInfo":
    "Content can only be imported and translated for secondary languages.",
  "johannschopplich.content-translator.dialog.translateButton": "Translate",
  "johannschopplich.content-translator.dialog.strategyLabel": "Translate with",
  "johannschopplich.content-translator.dialog.batchHelp":
    "Content from {language} will be translated and saved to all selected languages. This may take a few seconds.",
  "johannschopplich.content-translator.dialog.cascadeHelp":
    "{models} will also be translated and saved directly.",
  "johannschopplich.content-translator.coverage.title": "Translation Coverage",
  "johannschopplich.content-translator.coverage.pagesIncomplete":
    "{count} incomplete page | {count} incomplete pages",
  "johannschopplich.content-translator.coverage.allTranslated":
    "All pages translated",
  "johannschopplich.content-translator.coverage.pagesToTranslate":
    "Pages to Translate",
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
  data?: Record<string, unknown>,
  fallback?: string,
) {
  if (typeof data === "string") {
    fallback = data;
    data = undefined;
  }

  return string.template(translations[key] ?? fallback ?? key, data);
}
