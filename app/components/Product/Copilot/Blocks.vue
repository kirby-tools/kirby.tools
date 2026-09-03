<script setup lang="ts">
const BLOCKS: PanelBlock[] = [
  { type: "heading", level: "h2", text: "Rooms After Everyone Has Left" },
  {
    type: "text",
    text: EXHIBITION_PAGE.text.split("\n\n")[0]!,
  },
  {
    type: "quote",
    text: "I wait until the dust has settled inside the frame.",
    citation: "Anna Vogel",
  },
];
</script>

<template>
  <PanelMock>
    <PanelBlocksField name="text" label="Text" :blocks="BLOCKS" />
    <PanelNotification text="Content generated" />
  </PanelMock>
</template>
