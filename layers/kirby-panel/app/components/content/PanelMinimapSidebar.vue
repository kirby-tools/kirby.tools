<script setup lang="ts">
import type { MinimapField } from "#kirby-plugin/minimap";
import { MinimapSidebarView } from "#kirby-plugin/minimap";
import { translate } from "#panel-mock/translate";
// The minimap borrows the `--menu-*` tokens from Kirby's own menu, which no
// other Mock renders and whose stylesheet is therefore not in the bundle.
import "#kirby-panel/components/View/Menu.vue?vue&type=style&index=0&lang.css";

defineProps<{
  fields: MinimapField[];
}>();

const isOpen = ref(true);
</script>

<template>
  <MinimapSidebarView
    :fields="fields"
    :is-open="isOpen"
    :collapse-label="translate('collapse')"
    :expand-label="translate('expand')"
    :required-label="translate('field.required')"
    @toggle="isOpen = !isOpen"
  />
</template>

<style>
/* The plugin fixes the sidebar to the viewport. A Mock's Panel reaches no
   further than its own box, so the Panel element anchors the sidebar, the stage
   takes the margin, and the desktop state is staged at every width. */
.panel-mock .k-panel:has(> .k-panel-minimap) {
  --minimap-width: var(--minimap-width-open);
  position: relative;
}

.panel-mock .k-panel:has(> .k-panel-minimap[data-open="false"]) {
  --minimap-width: var(--minimap-width-closed);
}

.panel-mock .k-panel:has(> .k-panel-minimap) .panel-mock-stage {
  margin-inline-end: var(--minimap-width);
  /* The floor of Kirby's `--main-padding-inline`, the room the view keeps
     clear of the handle. */
  padding-inline-end: var(--spacing-6);
}

.panel-mock .k-panel-minimap {
  position: absolute;
  width: var(--minimap-width);
  border-left: 1px solid var(--menu-color-border);
  box-shadow: none;
}

.panel-mock .k-panel-minimap::before {
  content: none;
}

.panel-mock .k-panel-minimap-body {
  display: block;
  padding-block: var(--menu-padding);
  overflow: hidden;
}

/* The plugin measures the header's content box from the viewport top; a Mock
   has nothing above its header, so the offset is Kirby's own padding. */
.panel-mock .k-panel:has(.k-header) .k-panel-minimap-body {
  padding-top: calc(var(--header-padding-block) + var(--spacing-1));
}

/* The Panel fades the handle in on hover; here it stays visible. */
.panel-mock .k-panel-minimap-toggle {
  --button-height: 100%;
  inset-block: 0;
  opacity: 1;
}

.panel-mock .k-panel-minimap-menu-item {
  border-inline-start-width: 1px;
}
</style>
