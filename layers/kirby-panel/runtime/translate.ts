import string from "#kirby-panel/helpers/string";
import translationsJson from "../kirby/i18n/translations/en.json";

const translations: Record<string, string> = translationsJson;

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
