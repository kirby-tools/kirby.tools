<script setup lang="ts">
// Where `--overlay-color-back` is declared.
import "#kirby-panel/components/Layout/Overlay.vue?vue&type=style&index=0&lang.css";

defineProps<{
  align?: "start" | "end";
}>();
</script>

<template>
  <div class="panel-dialog-portal" :data-align="align">
    <slot />
  </div>
</template>

<style>
.panel-preview .panel-dialog-portal {
  position: absolute;
  inset: 0;
  z-index: var(--z-dialog);
  display: flex;
  overflow: auto;
  overscroll-behavior: contain;
  /* In place of `--dialog-margin`, which Kirby sizes for a viewport: the dialog
     keeps the inset of everything else on the stage. */
  padding: var(--panel-stage-inset);
  background: var(--overlay-color-back);
}

.panel-preview .panel-dialog-portal > * {
  margin: auto;
}

.panel-preview .panel-dialog-portal[data-align="start"] > * {
  margin-top: 0;
}

.panel-preview .panel-dialog-portal[data-align="end"] > * {
  margin-bottom: 0;
}
</style>
