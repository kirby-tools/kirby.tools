<script setup lang="ts">
const VIEW_BUTTONS: PanelViewButton[] = [
  {
    plugin: "content-translator",
    language: "de",
    languages: EXHIBITION_LANGUAGES.map(({ code }) => code),
    open: true,
  },
  ...kirbyViewButtons("de"),
];
</script>

<template>
  <PanelMock label="Deutsch">
    <PanelViewHeader
      :title="EXHIBITION_CONTENT.de.title"
      :buttons="VIEW_BUTTONS"
    />
  </PanelMock>
</template>
