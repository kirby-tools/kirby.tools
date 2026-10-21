<script setup lang="ts">
import type { ExhibitionLanguageCode } from "~/utils/exhibition";

const page = useExhibitionPage();
const autoplay = useSceneAutoplay("content-translator", [
  { click: "Translator" },
  { click: "EN → All Languages" },
  { click: "Translate" },
]);
const { cursor } = autoplay;
const {
  isOpen: isDialogOpen,
  openCount,
  hasReaderOpened: hasReaderOpenedDialog,
  open: openDialog,
  close: closeDialog,
} = useSceneDialog(autoplay);
const { languageCode } = page;
const reducedMotion = usePreferredReducedMotion();
const {
  notification,
  open: openNotification,
  close: closeNotification,
} = usePanelNotification();
const {
  isTranslating: isBatchTranslating,
  translate: translateBatch,
  stop: stopBatchTranslation,
} = useSceneBatchTranslation(page, openNotification);
const { isPending: isTranslatingContent, start: startContentTranslation } =
  useTimeoutFn(completeContentTranslation, LANGUAGE_TRANSLATION_DURATION, {
    immediate: false,
  });
const isBatchDialog = ref(true);
let targetLanguageCode: ExhibitionLanguageCode;

const isTranslating = computed(
  () => isBatchTranslating.value || isTranslatingContent.value,
);

const viewButton = computed<PanelViewButton>(() => ({
  plugin: "content-translator",
  language: languageCode.value,
  languages: EXHIBITION_LANGUAGES.map(({ code }) => code),
  isTranslating: isTranslating.value,
  run: ({ type }) => {
    if (type === "batch") openBatchDialog();
    else if (type === "import") importContent();
    else openContentDialog();
  },
}));

function openBatchDialog() {
  closeNotification();
  stopBatchTranslation();
  page.reset();
  isBatchDialog.value = true;
  openDialog();
}

function openContentDialog() {
  isBatchDialog.value = false;
  openDialog();
}

function submit(value: { languages?: string[] }) {
  closeDialog();
  if (isBatchDialog.value)
    translateBatch(value.languages as ExhibitionLanguageCode[]);
  else translateContent();
}

function importContent() {
  page.update(fieldsWithoutTitle(EXHIBITION_DEFAULT_LANGUAGE.code));
  openNotification({ text: "Content imported" });
}

function translateContent() {
  targetLanguageCode = languageCode.value;

  if (reducedMotion.value === "reduce") {
    completeContentTranslation();
    return;
  }

  openNotification({
    text: "Translating content…",
    icon: "loader",
    theme: "info",
  });
  startContentTranslation();
}

function completeContentTranslation() {
  // The plugin writes nothing once the editor has switched the language.
  if (languageCode.value !== targetLanguageCode) {
    openNotification({
      text: "You left the view or switched the language before the translation finished. Nothing was changed.",
      icon: "alert",
      theme: "negative",
    });
    return;
  }

  page.update(fieldsWithoutTitle(targetLanguageCode));
  openNotification({ text: "Content translated" });
}

// The plugin leaves the title alone unless its `title` option is set.
function fieldsWithoutTitle(code: ExhibitionLanguageCode) {
  const { title: _title, ...fields } = EXHIBITION_CONTENT[code];
  return fields;
}
</script>

<template>
  <ExhibitionScene
    :key="openCount"
    :page="page"
    :view-button="viewButton"
    :notification="notification"
    :cursor="cursor"
    @cancel="closeDialog"
    @close-notification="closeNotification"
  >
    <template v-if="isDialogOpen" #dialog>
      <PanelContentTranslatorDialog
        :batch="isBatchDialog"
        :languages="EXHIBITION_LANGUAGES"
        :autofocus="hasReaderOpenedDialog"
        @cancel="closeDialog"
        @submit="submit"
      />
    </template>
  </ExhibitionScene>
</template>
