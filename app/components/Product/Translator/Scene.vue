<script setup lang="ts">
import type { ExhibitionLanguageCode } from "~/utils/exhibition";

// Translating the current language asks only for the strategy.
const CONTENT_DIALOG_FIELDS = {
  strategyName: TRANSLATOR_DIALOG_FIELDS.strategyName,
};

const page = useExhibitionPage();
const autoplay = useSceneAutoplay("content-translator", [
  { click: PLUGIN_VIEW_BUTTONS["content-translator"].label },
  { click: TRANSLATOR_BATCH_TRANSLATION_TEXT },
  { click: TRANSLATOR_DIALOG_SUBMIT_BUTTON.text },
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
  component: "PanelContentTranslatorDropdownButton",
  props: {
    label: PLUGIN_VIEW_BUTTONS["content-translator"].label,
    theme: PLUGIN_VIEW_BUTTONS["content-translator"].theme,
    isTranslating: isTranslating.value,
    options: translatorDropdownOptions(languageCode.value, {
      isDisabled: isTranslating.value,
      translateBatch: openBatchDialog,
      importContent,
      translateContent: openContentDialog,
    }),
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

function submit(value: typeof TRANSLATOR_DIALOG_VALUE) {
  closeDialog();
  if (isBatchDialog.value) translateBatch(value.languages);
  else translateContent();
}

function importContent() {
  page.update(fieldsWithoutTitle("en"));
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
    closeNotification();
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
    :cursor="cursor"
    @cancel="closeDialog"
  >
    <template #notification>
      <PanelNotification
        v-if="notification"
        v-bind="notification"
        @click="closeNotification"
      />
    </template>

    <template v-if="isDialogOpen" #dialog>
      <PanelDialog
        size="medium"
        :autofocus="hasReaderOpenedDialog"
        :fields="
          isBatchDialog ? TRANSLATOR_DIALOG_FIELDS : CONTENT_DIALOG_FIELDS
        "
        :value="TRANSLATOR_DIALOG_VALUE"
        cancel-button
        :submit-button="TRANSLATOR_DIALOG_SUBMIT_BUTTON"
        @cancel="closeDialog"
        @submit="submit"
      />
    </template>
  </ExhibitionScene>
</template>
