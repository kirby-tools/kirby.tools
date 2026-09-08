<script setup lang="ts">
// Lives in `global/`, because `k-view-buttons` resolves the `component` key
// against the app the same way it does for a view button a plugin ships.

defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    options?: Record<string, unknown>[];
    alignX?: "start" | "end";
  }>(),
  { alignX: "end" },
);
</script>

<template>
  <div class="panel-view-button">
    <k-view-button v-bind="$attrs" dropdown />
    <PanelDropdown :options="options" :align-x="alignX" />
  </div>
</template>

<style>
/* Kirby's script places the dropdown flush under the button and lets it cover
   whatever the view puts below the header. The mock keeps it out of flow too,
   so the header keeps the height its border-bottom belongs at. */
.panel-view-button {
  position: relative;
}

/* A mock that stages the header alone has no view for the dropdown to cover, so
   the stage stands in for it. Enough for the dropdowns the docs show open; a
   taller one would clip visibly. */
.panel-mock .panel-mock-stage:has(.panel-view-button) {
  padding-bottom: var(--spacing-12);
}
</style>
