<script setup lang="ts">
defineProps<{
  theme?: string;
  icon?: string;
  text?: string;
}>();
</script>

<template>
  <k-box :theme="theme" :icon="icon" :text="text">
    <slot />
  </k-box>
</template>
