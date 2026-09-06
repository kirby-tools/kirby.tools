<script setup lang="ts">
const WRITER_TOOLBAR_BUTTONS = [
  { icon: "paragraph" },
  "|",
  { icon: "bold" },
  { icon: "italic" },
  { icon: "code" },
  "|",
  { icon: "url" },
  "|",
  { icon: "sparkling", current: true },
];

const SELECTION = EXHIBITION_PAGE.text.split("\n\n")[0];
</script>

<template>
  <PanelMock dialog-align="end">
    <PanelField label="Text" name="text" type="writer">
      <PanelInput
        :value="EXHIBITION_PAGE.text"
        :selection="SELECTION"
        :buttons="WRITER_TOOLBAR_BUTTONS"
      />
    </PanelField>

    <template #dialog>
      <PanelCopilotPromptDialog prompt="Make this shorter." selection />
    </template>
  </PanelMock>
</template>
