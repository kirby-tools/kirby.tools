<script setup lang="ts">
const BLOCKS: PanelBlock[] = [
  { type: "heading", level: "h2", text: "Räume nach dem Verlassen" },
  {
    type: "text",
    text: "Alma Frey fotografiert Räume, nachdem alle gegangen sind: eine Turnhalle am ersten Ferienmorgen, ein Fährterminal um vier Uhr früh, das Hinterzimmer eines Ladens, der im Frühjahr geschlossen hat.",
  },
  {
    type: "quote",
    text: "Ich warte, bis sich der Staub im Bild gesetzt hat.",
    citation: "Alma Frey",
  },
];
</script>

<template>
  <PanelMock label="Deutsch">
    <PanelBlocksField name="text" label="Text" :blocks="BLOCKS" />
  </PanelMock>
</template>
