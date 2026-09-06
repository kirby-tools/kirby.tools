<script setup lang="ts">
const VIEW_BUTTONS: PanelViewButton[] = [
  {
    ...PLUGIN_VIEW_BUTTONS["content-translator"],
    alignX: "start",
    options: [
      { icon: "import", text: "Import from EN" },
      "-",
      { icon: "translate", text: "Translate → DE" },
    ],
  },
  ...KIRBY_VIEW_BUTTONS,
];
</script>

<template>
  <PanelMock label="Deutsch">
    <PanelViewHeader
      title="Luise Frey: Räume der Stille"
      :buttons="VIEW_BUTTONS"
    />
  </PanelMock>
</template>
