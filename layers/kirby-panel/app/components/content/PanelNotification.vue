<script setup lang="ts">
import "#kirby-panel/components/View/Notifications.vue?vue&type=style&index=0&lang.css";

withDefaults(
  defineProps<{
    icon?: string;
    text?: string;
    theme?: string;
  }>(),
  { icon: "check", theme: "positive" },
);
</script>

<template>
  <k-button
    :icon="icon"
    :text="text"
    :theme="theme"
    variant="filled"
    class="k-panel-notification"
  />
</template>

<style>
/* Kirby offsets the toast by `--menu-padding`, which only the menu declares. */
.panel-preview .k-panel-notification {
  position: absolute;
  inset-block-end: var(--spacing-4);
  inset-inline-end: var(--spacing-4);
}
</style>
