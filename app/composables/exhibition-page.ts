import type {
  ExhibitionLanguageCode,
  ExhibitionPageContent,
} from "~/utils/exhibition";

const TRANSLATED_LANGUAGE_CODES: ExhibitionLanguageCode[] = ["de"];

export type ExhibitionPage = ReturnType<typeof useExhibitionPage>;

type ContentByLanguage = Partial<
  Record<ExhibitionLanguageCode, Partial<ExhibitionPageContent>>
>;

/** @param savedFields Fields that replace the Exhibition's saved content in every language, until a save in that language writes over them */
export function useExhibitionPage(
  savedFields: Partial<ExhibitionPageContent> = {},
) {
  const languageCode = ref<ExhibitionLanguageCode>(
    EXHIBITION_DEFAULT_LANGUAGE.code,
  );
  const translatedLanguageCodes = ref(TRANSLATED_LANGUAGE_CODES);
  // Shallow, so the blocks field gets back the array it reported rather than a
  // proxy of it, which it would render anew and lose the caret.
  const changes = shallowRef<ContentByLanguage>({});
  const saves = shallowRef<ContentByLanguage>({});

  // Kirby fills every field a translation lacks from the default language.
  const savedContent = computed<ExhibitionPageContent>(() => ({
    ...(translatedLanguageCodes.value.includes(languageCode.value)
      ? { ...EXHIBITION_PAGE, ...EXHIBITION_CONTENT[languageCode.value] }
      : EXHIBITION_PAGE),
    ...savedFields,
    ...saves.value[languageCode.value],
  }));

  const content = computed<ExhibitionPageContent>(() => ({
    ...savedContent.value,
    ...changes.value[languageCode.value],
  }));

  // Like Kirby's `$panel.content.diff()`: the fields whose changes differ from
  // the saved content.
  const diff = computed(() =>
    Object.fromEntries(
      Object.entries(content.value).filter(
        ([name, value]) =>
          JSON.stringify(value) !==
          JSON.stringify(
            savedContent.value[name as keyof ExhibitionPageContent],
          ),
      ),
    ),
  );
  const hasDiff = computed(() => Object.keys(diff.value).length > 0);

  /** Writes `fields` into the changes of `code`, the language the view shows unless given. */
  function update(
    fields: Partial<ExhibitionPageContent>,
    code = languageCode.value,
  ) {
    changes.value = {
      ...changes.value,
      [code]: { ...changes.value[code], ...fields },
    };
  }

  /** Saves the current language's changes, as the view's Save does. */
  function save() {
    const code = languageCode.value;
    saves.value = {
      ...saves.value,
      [code]: { ...saves.value[code], ...changes.value[code] },
    };
    discard();
  }

  /** Drops the current language's changes, as the view's Discard does. */
  function discard() {
    const rest = { ...changes.value };
    delete rest[languageCode.value];
    changes.value = rest;
  }

  function saveTranslations(languageCodes: ExhibitionLanguageCode[]) {
    translatedLanguageCodes.value = [
      ...new Set([...translatedLanguageCodes.value, ...languageCodes]),
    ];
  }

  /** Restores the Exhibition's content in every language, but stays in the language the view shows. */
  function reset() {
    translatedLanguageCodes.value = TRANSLATED_LANGUAGE_CODES;
    changes.value = {};
    saves.value = {};
  }

  return {
    languageCode,
    content,
    diff,
    hasDiff,
    update,
    save,
    discard,
    saveTranslations,
    reset,
  };
}
