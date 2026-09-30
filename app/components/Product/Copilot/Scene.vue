<script setup lang="ts">
const page = useExhibitionPage();
const {
  isOpen: isDialogOpen,
  openCount,
  hasReaderOpened: hasReaderOpenedDialog,
  open: openDialog,
  close: closeDialog,
} = useSceneDialog();
const {
  notification,
  open: openNotification,
  close: closeNotification,
} = usePanelNotification();
const {
  isGenerating,
  generate,
  abort: abortGeneration,
} = useSceneGeneration(page, openNotification);

const preview = computed(() =>
  COPILOT_PROMPT.replace("{title}", page.content.value.title),
);

// In Kirby, a language switch loads another view, which ends the stream.
watch(page.languageCode, abortGeneration);

const viewButton = computed<PanelViewButton>(() => ({
  component: "PanelCopilotButton",
  props: {
    ...PLUGIN_VIEW_BUTTONS.copilot,
    isGenerating: isGenerating.value,
    click: openPromptDialog,
    abort: abortGeneration,
  },
}));

function openPromptDialog() {
  closeNotification();
  abortGeneration();
  page.reset();
  openDialog();
}

function submit(value: { selectedFieldNames: string[] }) {
  closeDialog();
  generate(value.selectedFieldNames);
}
</script>

<template>
  <ExhibitionScene
    :key="openCount"
    :page="page"
    :view-button="viewButton"
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
      <!-- The plugin clears the picked fields on every open, so only the dialog
           open on load shows them picked. -->
      <PanelCopilotPromptDialog
        :autofocus="hasReaderOpenedDialog"
        :file-count="1"
        :fields="COPILOT_FIELDS"
        :user-prompt="COPILOT_PROMPT"
        :preview="preview"
        :dropdown="openCount > 0 ? undefined : COPILOT_FIELDS_DROPDOWN"
        @submit="submit"
      />
    </template>
  </ExhibitionScene>
</template>
