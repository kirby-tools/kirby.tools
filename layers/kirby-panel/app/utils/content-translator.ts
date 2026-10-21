const DEFAULT_LANGUAGES = ["en", "de"];

/**
 * Derives the plugin's actions the way its section and dropdown do, for a
 * site with a translation strategy set up: the imports, then the translations.
 */
export function contentTranslatorActions(
  options: PanelContentTranslatorOptions,
): PanelContentTranslatorAction[][] {
  const {
    languages,
    language,
    defaultLanguage,
    isDefaultLanguage,
    isImportEnabled,
    isImportFromAll,
    isBatchTranslationEnabled,
  } = resolveOptions(options);

  const translateAction = (
    disabled: boolean,
  ): PanelContentTranslatorAction => ({
    type: "translate",
    text: `Translate → ${language.toUpperCase()}`,
    icon: "translate",
    disabled,
  });
  const batchActions: PanelContentTranslatorAction[] =
    isBatchTranslationEnabled && isDefaultLanguage
      ? [
          {
            type: "batch",
            text: `${defaultLanguage.toUpperCase()} → All Languages`,
            icon: "content-translator-global",
            disabled: false,
          },
        ]
      : [];

  if (isImportFromAll) {
    return [
      languages
        .filter((code) => code !== language)
        .map((code) => ({
          type: "import",
          text: `Import from ${code.toUpperCase()}`,
          icon: "import",
          disabled: false,
          from: code,
        })),
      [translateAction(false), ...batchActions],
    ];
  }

  const isPerLanguage = !isBatchTranslationEnabled || !isDefaultLanguage;

  return [
    isImportEnabled && isPerLanguage
      ? [
          {
            type: "import",
            text: "Import",
            icon: "import",
            disabled: isDefaultLanguage,
          },
        ]
      : [],
    [
      ...(isPerLanguage ? [translateAction(isDefaultLanguage)] : []),
      ...batchActions,
    ],
  ];
}

/**
 * Tells whether the plugin's section explains that only secondary languages
 * take imports and translations, which it does in the default language once
 * batch translation is off.
 */
export function hasContentTranslatorDefaultLanguageInfo(
  options: PanelContentTranslatorOptions,
) {
  const { isDefaultLanguage, isImportFromAll, isBatchTranslationEnabled } =
    resolveOptions(options);
  return !isImportFromAll && !isBatchTranslationEnabled && isDefaultLanguage;
}

function resolveOptions({
  languages = DEFAULT_LANGUAGES,
  language = languages[0]!,
  import: isImportEnabled = true,
  importFrom,
  batch: isBatchTranslationEnabled = true,
}: PanelContentTranslatorOptions) {
  const defaultLanguage = languages[0]!;
  return {
    languages,
    language,
    defaultLanguage,
    isDefaultLanguage: language === defaultLanguage,
    isImportEnabled,
    isImportFromAll: isImportEnabled && importFrom === "all",
    isBatchTranslationEnabled,
  };
}
