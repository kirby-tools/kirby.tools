<script setup lang="ts">
// Where `--menu-padding` is declared.
import "#kirby-panel/components/View/Menu.vue?vue&type=style&index=0&lang.css";
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
.panel-mock .k-panel-notification {
  position: absolute;
}
</style>
