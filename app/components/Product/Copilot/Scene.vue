<script setup lang="ts">
const isInert = inject(panelMockInertKey, false);
// Copilot appends to the `text` blocks, which a Crop would hide below saved
// ones.
const page = useExhibitionPage(isInert ? {} : { text: [], description: "" });
const typedLength = ref(0);
const {
  cursor,
  isPending,
  notification,
  openNotification,
  closeNotification,
  isDialogOpen,
  openCount,
  hasReaderOpenedDialog,
  closeDialog,
  restart,
} = useScene("copilot", page, [
  { click: "Copilot" },
  { run: typePrompt },
  { click: "Fields" },
  { click: "Text" },
  { click: "Description" },
  { click: "Generate" },
]);
const {
  isGenerating,
  generate,
  abort: abortGeneration,
} = useSceneGeneration(page, openNotification);

const userPrompt = computed(() =>
  isPending.value ? COPILOT_PROMPT.slice(0, typedLength.value) : COPILOT_PROMPT,
);
const preview = computed(() =>
  userPrompt.value.replace("{title}", page.content.value.title),
);

// In Kirby, a language switch loads another view, which ends the stream.
watch(page.languageCode, abortGeneration);

const viewButton = computed<PanelViewButton>(() => ({
  plugin: "copilot",
  isGenerating: isGenerating.value,
  click: openPromptDialog,
  abort: abortGeneration,
}));

function openPromptDialog() {
  abortGeneration();
  restart();
}

function submit(value: { selectedFieldNames: string[] }) {
  closeDialog();
  generate(value.selectedFieldNames);
}

// Types from where a paused run stopped.
async function typePrompt(signal: AbortSignal) {
  while (typedLength.value < COPILOT_PROMPT.length) {
    await sleep(keystrokeDuration(typedLength.value), signal);
    typedLength.value++;
  }
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
      <!-- The plugin clears the picked fields on every open, so only the dialog
           open on load shows them picked. -->
      <PanelCopilotPromptDialog
        :autofocus="hasReaderOpenedDialog"
        :file-count="1"
        :fields="COPILOT_FIELDS"
        :user-prompt="userPrompt"
        :preview="preview"
        :dropdown="openCount > 0 ? undefined : COPILOT_FIELDS_DROPDOWN"
        @submit="submit"
      />
    </template>
  </ExhibitionScene>
</template>
