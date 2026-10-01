import type {
  ExhibitionLanguageCode,
  ExhibitionPageContent,
} from "~/utils/exhibition";

const TRANSLATED_LANGUAGE_CODES: ExhibitionLanguageCode[] = ["de"];

export type ExhibitionPage = ReturnType<typeof useExhibitionPage>;

export function useExhibitionPage(
  savedFields: Partial<ExhibitionPageContent> = {},
) {
  const languageCode = ref<ExhibitionLanguageCode>("en");
  const translatedLanguageCodes = ref(TRANSLATED_LANGUAGE_CODES);
  // Shallow, so the blocks field gets back the array it reported rather than a
  // proxy of it, which it would render anew and lose the caret.
  const changes = shallowRef<
    Partial<Record<ExhibitionLanguageCode, Partial<ExhibitionPageContent>>>
  >({});

  // Kirby fills every field a translation lacks from the default language.
  const savedContent = computed<ExhibitionPageContent>(() => ({
    ...(translatedLanguageCodes.value.includes(languageCode.value)
      ? { ...EXHIBITION_PAGE, ...EXHIBITION_CONTENT[languageCode.value] }
      : EXHIBITION_PAGE),
    ...savedFields,
  }));

  const content = computed<ExhibitionPageContent>(() => ({
    ...savedContent.value,
    ...changes.value[languageCode.value],
  }));

  const hasDiff = computed(
    () => JSON.stringify(content.value) !== JSON.stringify(savedContent.value),
  );

  function update(fields: Partial<ExhibitionPageContent>) {
    changes.value = {
      ...changes.value,
      [languageCode.value]: { ...changes.value[languageCode.value], ...fields },
    };
  }

  function saveTranslations(languageCodes: ExhibitionLanguageCode[]) {
    translatedLanguageCodes.value = [
      ...new Set([...translatedLanguageCodes.value, ...languageCodes]),
    ];
  }

  function reset() {
    languageCode.value = "en";
    translatedLanguageCodes.value = TRANSLATED_LANGUAGE_CODES;
    changes.value = {};
  }

  return { languageCode, content, hasDiff, update, saveTranslations, reset };
}
