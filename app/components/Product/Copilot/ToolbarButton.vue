<script setup lang="ts">
const WRITER_TOOLBAR_BUTTONS = [
  { icon: "paragraph", current: true },
  "|",
  { icon: "bold", title: "Bold" },
  { icon: "italic", title: "Italic" },
  { icon: "code", title: "Code" },
  "|",
  { icon: "url", title: "Link" },
  "|",
  { icon: "sparkling", title: "Copilot" },
];

const PARAGRAPHS = EXHIBITION_PAGE.text.flatMap((block) =>
  block.type === "text" ? [block.text] : [],
);
const SELECTION = PARAGRAPHS[0];
</script>

<template>
  <PanelMock dialog-align="end">
    <PanelField label="Text" name="text" type="writer">
      <PanelInput
        :value="PARAGRAPHS.join('\n\n')"
        :selection="SELECTION"
        :buttons="WRITER_TOOLBAR_BUTTONS"
      />
    </PanelField>

    <template #dialog>
      <PanelCopilotPromptDialog
        user-prompt="Make this shorter."
        :selection="SELECTION"
      />
    </template>
  </PanelMock>
</template>
