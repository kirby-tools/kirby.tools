/** A site in English and German, the default of the Translator's section and dropdown Mocks. */
const DEFAULT_LANGUAGES = ["en", "de"];

/**
 * Derives the plugin's actions the way its section and dropdown do, for a
 * site with a translation strategy set up: the imports, then the translations.
 */
export function contentTranslatorActions({
  languages = DEFAULT_LANGUAGES,
  language = languages[0]!,
  import: isImportEnabled = true,
  importFrom,
  batch: isBatchTranslationEnabled = true,
}: PanelContentTranslatorOptions): PanelContentTranslatorAction[][] {
  const defaultLanguage = languages[0]!;
  const isDefaultLanguage = language === defaultLanguage;

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

  if (isImportEnabled && importFrom === "all") {
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
