<script setup lang="ts">
const BLOCKS: PanelBlock[] = [
  { type: "heading", level: "h2", text: "Räume nach dem Verlassen" },
  {
    type: "text",
    text: "Anna Vogel fotografiert Räume, nachdem alle gegangen sind: eine Turnhalle am ersten Ferienmorgen, ein Fährterminal um vier Uhr früh, das Hinterzimmer eines Ladens, der im Frühjahr geschlossen hat.",
  },
  {
    type: "quote",
    text: "Ich warte, bis sich der Staub im Bild gesetzt hat.",
    citation: "Anna Vogel",
  },
];
</script>

<template>
  <PanelPreview label="Deutsch">
    <PanelBlocksField name="text" label="Text" :blocks="BLOCKS" />
  </PanelPreview>
</template>
