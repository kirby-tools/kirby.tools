<script setup lang="ts">
const isInert = inject(panelMockInertKey, false);
// The page starts without the text and description the prompt asks for:
// Copilot appends to the `text` blocks, which a Crop would hide below saved
// ones. A still Scene generates nothing and keeps both.
const page = useExhibitionPage(isInert ? {} : { text: [], description: "" });
const typedLength = ref(0);
const autoplay = useSceneAutoplay("copilot", [
  { click: PLUGIN_VIEW_BUTTONS.copilot.label },
  { run: typePrompt },
  { click: "Fields" },
  { click: "Text" },
  { click: "Description" },
  { click: "Generate" },
]);
const { cursor, isPending } = autoplay;
const {
  isOpen: isDialogOpen,
  openCount,
  hasReaderOpened: hasReaderOpenedDialog,
  open: openDialog,
  close: closeDialog,
} = useSceneDialog(autoplay);
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

const userPrompt = computed(() =>
  isPending.value ? COPILOT_PROMPT.slice(0, typedLength.value) : COPILOT_PROMPT,
);
const preview = computed(() =>
  userPrompt.value.replace("{title}", page.content.value.title),
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

// Types from where a paused run stopped.
async function typePrompt(signal: AbortSignal) {
  while (typedLength.value < COPILOT_PROMPT.length) {
    await new Promise((resolve) =>
      setTimeout(resolve, keystrokeDuration(typedLength.value)),
    );
    if (signal.aborted) return;
    typedLength.value++;
  }
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
