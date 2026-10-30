import string from "#kirby-panel/helpers/string";
import { translations as contentTranslatorTranslations } from "#kirby-plugin/content-translator";
import { translations as copilotTranslations } from "#kirby-plugin/copilot";
import { translations as deployTriggerTranslations } from "#kirby-plugin/deploy-trigger";
import { translations as livePreviewTranslations } from "#kirby-plugin/live-preview";
import { translations as seoAuditTranslations } from "#kirby-plugin/seo-audit";
import { translations as serpPreviewTranslations } from "#kirby-plugin/serp-preview";
import kirbyTranslations from "../kirby/i18n/translations/en.json";

const translations: Record<string, string> = {
  ...kirbyTranslations,
  ...contentTranslatorTranslations,
  ...copilotTranslations,
  ...deployTriggerTranslations,
  ...livePreviewTranslations,
  ...seoAuditTranslations,
  ...serpPreviewTranslations,
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
