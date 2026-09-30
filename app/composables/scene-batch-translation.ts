import type { ExhibitionLanguageCode } from "~/utils/exhibition";

export const LANGUAGE_TRANSLATION_DURATION = 500;

export function useSceneBatchTranslation(
  page: ExhibitionPage,
  notify: (notification: PanelNotificationProps) => void,
) {
  const reducedMotion = usePreferredReducedMotion();
  const batchLanguageCodes = ref<ExhibitionLanguageCode[]>([]);
  const completedCount = ref(0);

  const {
    isActive: isTranslating,
    pause: stopTranslation,
    resume: startTranslation,
  } = useIntervalFn(translateNextLanguage, LANGUAGE_TRANSLATION_DURATION, {
    immediate: false,
  });

  function translate(languageCodes: string[]) {
    batchLanguageCodes.value = EXHIBITION_LANGUAGES.map(
      ({ code }) => code,
    ).filter((code) => languageCodes.includes(code));
    if (batchLanguageCodes.value.length === 0) return;

    if (reducedMotion.value === "reduce") {
      completeTranslation();
      return;
    }

    completedCount.value = 0;
    notifyProgress();
    startTranslation();
  }

  function translateNextLanguage() {
    if (completedCount.value < batchLanguageCodes.value.length) {
      completedCount.value++;
      notifyProgress();
      return;
    }

    stopTranslation();
    completeTranslation();
  }

  function notifyProgress() {
    notify({
      text: `Translating content… ${completedCount.value}/${batchLanguageCodes.value.length}`,
      icon: "loader",
      theme: "info",
    });
  }

  function completeTranslation() {
    page.saveTranslations(batchLanguageCodes.value);
    notify({ text: "Content translated for the selected languages" });
  }

  return { isTranslating, translate, stop: stopTranslation };
}
