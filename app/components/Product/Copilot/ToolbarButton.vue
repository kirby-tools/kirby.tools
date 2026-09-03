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
  <PanelMock>
    <PanelField label="Text" name="text" type="writer">
      <PanelInput
        :value="EXHIBITION_PAGE.text"
        :selection="SELECTION"
        :buttons="WRITER_TOOLBAR_BUTTONS"
      />
    </PanelField>

    <PanelDialogPortal align="end">
      <PanelCopilotPromptDialog prompt="Make this shorter." selection />
    </PanelDialogPortal>
  </PanelMock>
</template>
