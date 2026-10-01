<script setup lang="ts">
const PROMPT =
  'Generate a landing page for "{title}". Use 1/1 and 1/2 columns.';

const FIELDS: PanelFieldProps[] = [{ name: "layout", label: "Layout" }];

const FIELDS_DROPDOWN = {
  under: "fields",
  value: ["layout"],
} as const satisfies PanelCopilotPromptDropdown;

// An empty layout field leaves the view shorter than the prompt dialog with its
// dropdown open, which a Panel view never is.
const STAGE_CLASS = "[&_.panel-mock-stage]:min-h-80";

const GENERATED_LAYOUTS: PanelLayout[] = [
  {
    columns: [
      {
        width: "1/1",
        blocks: [
          {
            type: "heading",
            level: "h2",
            text: "Six Winters, Twenty-Eight Empty Rooms",
          },
          {
            type: "text",
            text: "A school gym on the first morning of the holidays, a ferry terminal at four, the back office of a shop after closing time. Luise Frey waits with a large-format camera until everyone has gone.",
          },
        ],
      },
    ],
  },
  {
    columns: [
      {
        width: "1/2",
        blocks: [
          { type: "heading", level: "h3", text: "Visit" },
          {
            type: "text",
            text: "Kunsthalle Leipzig, 12 September to 30 November. Tuesday to Sunday, 10 am to 6 pm.",
          },
        ],
      },
      {
        width: "1/2",
        blocks: [
          { type: "heading", level: "h3", text: "Meet the Artist" },
          {
            type: "text",
            text: "Luise Frey talks about the series on 14 November at 7 pm. Admission is free.",
          },
        ],
      },
    ],
  },
];

const isDialogOpen = ref(true);
const hasReaderOpenedDialog = ref(false);
const layouts = shallowRef<PanelLayout[]>([]);
const {
  notification,
  open: openNotification,
  close: closeNotification,
} = usePanelNotification();
const {
  isStreaming: isGenerating,
  start: generate,
  stop: abortGeneration,
} = useTokenStream(streamLayouts);

const viewButtons = computed<PanelViewButton[]>(() => [
  {
    component: "PanelCopilotButton",
    props: {
      ...PLUGIN_VIEW_BUTTONS.copilot,
      isGenerating: isGenerating.value,
      click: openDialog,
      abort: abortGeneration,
    },
  },
  ...kirbyViewButtons(),
]);

function openDialog() {
  closeNotification();
  abortGeneration();
  layouts.value = [];
  isDialogOpen.value = true;
  hasReaderOpenedDialog.value = true;
}

function submit() {
  isDialogOpen.value = false;
  generate();
}

// Shows a row, a column, or a block once its first token has streamed.
function streamLayouts(tokenCount: number) {
  const { take, hasTokensLeft } = createTokenBudget(tokenCount);

  layouts.value = GENERATED_LAYOUTS.flatMap((layout) => {
    const columns = layout.columns.flatMap((column) => {
      const blocks = column.blocks.flatMap((block) => {
        const text = take(block.text);
        return text ? [{ ...block, text }] : [];
      });
      return blocks.length ? [{ ...column, blocks }] : [];
    });
    return columns.length ? [{ columns }] : [];
  });

  const isComplete = hasTokensLeft();
  if (isComplete) openNotification({ text: "Content generated" });
  return isComplete;
}
</script>

<template>
  <PanelMock :class="STAGE_CLASS" @cancel="isDialogOpen = false">
    <PanelViewHeader
      :title="EXHIBITION_PAGE.title"
      :buttons="viewButtons"
      :has-diff="layouts.length > 0"
    />

    <PanelSection>
      <PanelFieldset>
        <PanelLayoutField
          name="layout"
          label="Layout"
          help="Describe the page to Copilot, and it builds the rows from our blocks."
          :value="layouts"
        />
      </PanelFieldset>
    </PanelSection>

    <PanelNotification
      v-if="notification"
      v-bind="notification"
      @click="closeNotification"
    />

    <template v-if="isDialogOpen" #dialog>
      <!-- The plugin clears the picked fields on every open, so only the dialog
           open on load shows them picked. -->
      <PanelCopilotPromptDialog
        :fields="FIELDS"
        :user-prompt="PROMPT"
        :preview="PROMPT.replace('{title}', EXHIBITION_PAGE.title)"
        :dropdown="hasReaderOpenedDialog ? undefined : FIELDS_DROPDOWN"
        :autofocus="hasReaderOpenedDialog"
        @submit="submit"
      />
    </template>
  </PanelMock>
</template>
