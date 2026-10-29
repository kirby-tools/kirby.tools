import type { PanelContentTranslatorOptions } from "../types/plugins";
import { resolveTranslatorActions } from "#kirby-plugin/content-translator";
import { translate } from "#panel-mock/translate";

const DEFAULT_LANGUAGES = ["en", "de"];

/**
 * Resolves the plugin's actions for a site with a translation strategy set up.
 * The caller sets `import` and `batch`, since Vue casts an absent boolean prop
 * to `false`.
 */
export function useTranslatorActions(
  options: PanelContentTranslatorOptions &
    Required<Pick<PanelContentTranslatorOptions, "import" | "batch">> & {
      isTranslating?: boolean;
    },
) {
  return computed(() => {
    const languages = options.languages ?? DEFAULT_LANGUAGES;

    return resolveTranslatorActions({
      languageCodes: languages,
      viewLanguageCode: options.language ?? languages[0]!,
      defaultLanguageCode: languages[0]!,
      isImportEnabled: options.import,
      importFrom: options.importFrom,
      isBatchTranslationEnabled: options.batch,
      hasAnyStrategy: true,
      isDisabled: options.isTranslating ?? false,
      t: translate,
    });
  });
}
