<script setup lang="ts">
const VIEW_BUTTONS: PanelViewButton[] = [
  {
    text: PLUGIN_VIEW_BUTTONS["content-translator"].label,
    icon: PLUGIN_VIEW_BUTTONS["content-translator"].icon,
    theme: PLUGIN_VIEW_BUTTONS["content-translator"].theme,
    responsive: true,
    options: [
      { icon: "import", text: "Import from EN" },
      "-",
      { icon: "translate", text: "Translate → DE" },
    ],
    alignX: "start",
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
