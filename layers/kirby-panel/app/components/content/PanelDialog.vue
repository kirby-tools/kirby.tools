<script setup lang="ts">
// Kirby's `k-dialog` teleports into a portal the Panel owns, which puts its
// content beside the page rather than in the mock.
import "#kirby-panel/components/Dialogs/Dialog.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Dialogs/Elements/Body.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Dialogs/Elements/Buttons.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Dialogs/Elements/Footer.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Layout/Overlay.vue?vue&type=style&index=0&lang.css";

withDefaults(
  defineProps<{
    size?: "small" | "default" | "medium" | "large" | "huge";
    buttons?: Record<string, unknown>[];
  }>(),
  { size: "default" },
);
</script>

<template>
  <div class="panel-dialog k-dialog" :data-size="size">
    <div class="k-dialog-body">
      <slot />
    </div>

    <footer v-if="buttons" class="k-dialog-footer">
      <k-button-group class="k-dialog-buttons">
        <k-button
          v-for="(button, index) in buttons"
          :key="index"
          variant="filled"
          v-bind="button"
        />
      </k-button-group>
    </footer>
  </div>
</template>

<style>
/* Kirby's portal centers the dialog over the whole viewport and dims the Panel
   behind it. The stage stands in for the portal here. */
.panel-preview .panel-preview-stage:has(> .panel-dialog) {
  display: flex;
  justify-content: center;
  background: var(--overlay-color-back);
}
</style>
