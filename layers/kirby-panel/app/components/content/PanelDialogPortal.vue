<script setup lang="ts">
// Where `--overlay-color-back` is declared.
import "#kirby-panel/components/Layout/Overlay.vue?vue&type=style&index=0&lang.css";
</script>

<template>
  <div class="panel-dialog-portal">
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
  /* Kirby reserves `--dialog-margin` against a viewport. The stage is a few
     hundred pixels wide, so the inset it reserves is the stage's own. */
  padding: var(--spacing-4);
  background: var(--overlay-color-back);
}

.panel-preview .panel-dialog-portal > * {
  margin: auto;
}
</style>
